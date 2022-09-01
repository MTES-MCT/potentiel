import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { Readable } from 'stream'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationReceived } from '../events'
import { makeChangerProducteur } from './changerProducteur'

describe('changerProducteur use-case', () => {
  const shouldUserAccessProject = jest.fn(async () => true)
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = { ...makeFakeProject(), producteur: 'initial producteur' }
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

      const changerProducteur = makeChangerProducteur({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await changerProducteur({
        projetId: fakeProject.id.toString(),
        porteur: fakeUser,
        nouveauProducteur: 'new producteur',
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when user is allowed', () => {
    const newProducteur = 'new producteur'

    beforeAll(async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const changerProducteur = makeChangerProducteur({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await changerProducteur({
        projetId: fakeProject.id.toString(),
        porteur: fakeUser,
        nouveauProducteur: newProducteur,
        fichier: { contents: fakeFileContents, filename: fakeFileName },
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

      const { type, producteur } = event.payload
      expect(type).toEqual('producteur')
      expect(producteur).toEqual(newProducteur)
    })

    it('should update the Producteur', () => {
      expect(fakeProject.updateProducteur).toHaveBeenCalledWith(fakeUser, 'new producteur')
    })

    it('should save the file', () => {
      expect(fileRepo.save).toHaveBeenCalledTimes(1)
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
      expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName)
    })
  })
})
