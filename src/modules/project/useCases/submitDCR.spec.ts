import { Readable } from 'stream'
import { DomainEvent, EventBus, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { ProjectDCRSubmitted } from '../events'
import { makeSubmitDCR } from './submitDCR'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'

const projectId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fileRepo = {
  save: jest.fn((file: FileObject) => okAsync(null)),
  load: jest.fn(),
}

const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet', id: userId })))

describe('submitDCR use-case', () => {
  describe(`Lorsque l'utilisateur n'a pas les droits sur le projet`, () => {
    it('Alors une erreur de type UnauthorizedError doit être retournée', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const submitDCR = makeSubmitDCR({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await submitDCR({
        type: 'dcr',
        file: fakeFileContents,
        stepDate: new Date(123),
        projectId,
        submittedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Lorsque l'utilisateur a les droits d'accès au projet`, () => {
    const dcrDate = new Date(123)

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const shouldUserAccessProject = jest.fn(async () => true)

    const submitDCR = makeSubmitDCR({
      fileRepo: fileRepo as Repository<FileObject>,
      projectRepo,
      shouldUserAccessProject,
    })

    beforeAll(async () => {
      fakePublish.mockClear()

      const res = await submitDCR({
        type: 'dcr',
        file: fakeFileContents,
        stepDate: dcrDate,
        numeroDossier: 'dossier123',
        projectId,
        submittedBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('Le fichier doit-être sauvegardé', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
    })

    describe(`Lorsqu'un fichier de type DCR a déjà été soumis au projet`, () => {
      it('Alors on doit appeler la méthode "submitDemandeComplèteRaccordement"', async () => {
        const res = await submitDCR({
          type: 'dcr',
          file: fakeFileContents,
          stepDate: dcrDate,
          numeroDossier: 'dossier123',
          projectId,
          submittedBy: user,
        })

        expect(res.isOk()).toBe(true)
        expect(fileRepo.save).toHaveBeenCalled()

        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(fakeProject.submitDemandeComplèteRaccordement).toHaveBeenCalledWith({
          projectId,
          dcrDate,
          fileId: fakeFile.id.toString(),
          numeroDossier: 'dossier123',
          submittedBy: user.id,
        })
      })
    })
  })
})
