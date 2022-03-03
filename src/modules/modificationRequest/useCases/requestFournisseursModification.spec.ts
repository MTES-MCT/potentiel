import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { Readable } from 'stream'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { FournisseurKind, Project } from '../../project'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { ModificationReceived } from '../events'
import { makeRequestFournisseursModification } from './requestFournisseursModification'

describe('requestFournisseurModification use-case', () => {
  const shouldUserAccessProject = jest.fn(async () => true)
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
  const fakeProject = {
    ...makeFakeProject(),
  }
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

      const requestFournisseurModification = makeRequestFournisseursModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await requestFournisseurModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newFournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'fail' }],
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when user is allowed', () => {
    const newFournisseurs = [
      {
        kind: 'Nom du fabricant \n(Modules ou films)' as FournisseurKind,
        name: 'fournisseur modules films',
      },
      { kind: 'Nom du fabricant (Cellules)' as FournisseurKind, name: 'fournisseur cellules' },
    ]
    const newEvaluationCarbone = 100

    beforeAll(async () => {
      fakePublish.mockClear()
      fileRepo.save.mockClear()

      const requestFournisseurModification = makeRequestFournisseursModification({
        projectRepo,
        eventBus,
        shouldUserAccessProject,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const res = await requestFournisseurModification({
        projectId: fakeProject.id,
        requestedBy: fakeUser,
        newFournisseurs,
        newEvaluationCarbone,
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

      const { type, fournisseurs, evaluationCarbone } = event.payload

      expect(type).toEqual('fournisseur')
      expect(fournisseurs).toMatchObject(newFournisseurs)
      expect(evaluationCarbone).toEqual(newEvaluationCarbone)
    })

    it('should update the fournisseurs and the evaluation carbone', () => {
      expect(fakeProject.updateFournisseurs).toHaveBeenCalledWith(
        fakeUser,
        newFournisseurs,
        newEvaluationCarbone
      )
    })

    it('should save the file', () => {
      expect(fileRepo.save).toHaveBeenCalledTimes(1)
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
      expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName)
    })
  })
})
