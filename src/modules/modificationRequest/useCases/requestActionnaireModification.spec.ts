import { Readable } from 'stream'
import { DomainEvent, Repository } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationReceived, ModificationRequested } from '../events'
import { makeRequestActionnaireModification } from './requestActionnaireModification'

describe('requestActionnaireModification use-case', () => {
  const shouldUserAccessProject = jest.fn(async () => true)
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = { ...makeFakeProject(), actionnaire: 'initial actionnaire' }
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
  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'

  describe('when user is not allowed', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const requestActionnaireModification = makeRequestActionnaireModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await requestActionnaireModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newActionnaire: 'new actionnaire',
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when user is allowed', () => {
    beforeAll(async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const newActionnaire = 'new actionnaire'

      const requestActionnaireModification = makeRequestActionnaireModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await requestActionnaireModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newActionnaire,
        file: { contents: fakeFileContents, filename: fakeFileName },
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
    })

    it('should update the Actionnaire', () => {
      expect(fakeProject.updateActionnaire).toHaveBeenCalledWith(fakeUser, 'new actionnaire')
    })

    it('should save the file', () => {
      expect(fileRepo.save).toHaveBeenCalledTimes(1)
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
      expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName)
    })
  })
})
