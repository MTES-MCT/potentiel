import { Readable } from 'stream'
import { IsModificationPuissanceAuto, PuissanceJustificationOrCourrierMissingError } from '..'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationReceived, ModificationRequested } from '../events'
import { makeRequestPuissanceModification } from './requestPuissanceModification'

describe('requestPuissanceModification use-case', () => {
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = { ...makeFakeProject(), puissanceInitiale: 100 }
  const projectRepo = fakeTransactionalRepo(fakeProject as Project)
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }
  const file = { contents: Readable.from('test-content'), filename: 'myfilename.pdf' }

  describe('when user is not allowed', () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    const requestPuissanceModification = makeRequestPuissanceModification({
      projectRepo,
      eventBus,
      shouldUserAccessProject,
      isModificationPuissanceAuto: () => true,
      fileRepo: fileRepo as Repository<FileObject>,
    })
    const newPuissance = 89

    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const res = await requestPuissanceModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newPuissance,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when user has rights to this project', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    describe('when the modification is not auto accepted', () => {
      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        isModificationPuissanceAuto: () => false,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const newPuissance = 89

      describe('when there is no justification nor a courrier attached to the demand', () => {
        beforeAll(async () => {
          fakePublish.mockClear()
          fileRepo.save.mockClear()
        })

        it('should return a PuissanceJustificationOrCourrierMissingError', async () => {
          const res = await requestPuissanceModification({
            projectId: fakeProject.id,
            requestedBy: fakeUser,
            newPuissance,
          })

          expect(res.isErr()).toBe(true)
          if (res.isOk()) return
          expect(res.error).toBeInstanceOf(PuissanceJustificationOrCourrierMissingError)
        })
      })

      describe('when a courrier or a justification is attached to the demand', () => {
        beforeAll(async () => {
          fakePublish.mockClear()
          fileRepo.save.mockClear()

          const res = await requestPuissanceModification({
            projectId: fakeProject.id,
            requestedBy: fakeUser,
            newPuissance,
            file,
          })

          expect(res.isOk()).toBe(true)

          expect(shouldUserAccessProject).toHaveBeenCalledWith({
            user: fakeUser,
            projectId: fakeProject.id.toString(),
          })
        })

        it('should emit a ModificationRequested', () => {
          expect(eventBus.publish).toHaveBeenCalledTimes(1)
          const event = eventBus.publish.mock.calls[0][0]
          expect(event).toBeInstanceOf(ModificationRequested)

          const { type, puissance, justification } = event.payload
          expect(type).toEqual('puissance')
          expect(puissance).toEqual(newPuissance)
        })

        it('should not change the project', () => {
          expect(fakeProject.pendingEvents).toHaveLength(0)
        })

        it('should save the file', () => {
          expect(fileRepo.save).toHaveBeenCalledTimes(1)
          expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents)
          expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename)
        })
      })
    })

    describe('when the modification is auto accepted', () => {
      const requestPuissanceModification = makeRequestPuissanceModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        isModificationPuissanceAuto: () => true,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      const newPuissance = 105

      beforeAll(async () => {
        fakePublish.mockClear()
        fileRepo.save.mockClear()

        const res = await requestPuissanceModification({
          projectId: fakeProject.id,
          requestedBy: fakeUser,
          newPuissance,
          file,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        })
      })

      it('should emit a ModificationReceived', async () => {
        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        const event = eventBus.publish.mock.calls[0][0]
        expect(event).toBeInstanceOf(ModificationReceived)

        const { type, puissance } = event.payload
        expect(type).toEqual('puissance')
        expect(puissance).toEqual(newPuissance)
      })

      it('should update the puissance', () => {
        expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, newPuissance)
      })

      it('should save the file', () => {
        expect(fileRepo.save).toHaveBeenCalledTimes(1)
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents)
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename)
      })
    })
  })
})
