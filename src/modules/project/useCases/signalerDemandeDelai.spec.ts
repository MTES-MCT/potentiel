import { DomainEvent, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeSignalerDemandeDelai } from './signalerDemandeDelai'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { Readable } from 'stream'
import { ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError } from '../errors'

const projectId = new UniqueEntityID().toString()
const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('signalerDemandeDelai use-case', () => {
  describe(`Lorsque l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const signalerDemandeDelai = makeSignalerDemandeDelai({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeDelai({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        newCompletionDueOn: new Date('2025-01-31'),
        signaledBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
  describe(`Lorsque l'utilisateur a les droits sur le projet`, () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      fakePublish.mockClear()

      const signalerDemandeDelai = makeSignalerDemandeDelai({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeDelai({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        newCompletionDueOn: new Date('2025-01-31'),
        notes: 'notes',
        file: fakeFileContents,
        signaledBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('Alors le fichier devrait être sauvegardé', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
    })

    it(`Alors la méthode project.signalerDemandDelai devrait être appelée`, () => {
      const fakeFile = fileRepo.save.mock.calls[0][0]
      expect(fakeProject.signalerDemandeDelai).toHaveBeenCalledWith({
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        newCompletionDueOn: new Date('2025-01-31'),
        notes: 'notes',
        attachment: { id: fakeFile.id.toString(), name: fakeFileContents.filename },
        signaledBy: user,
      })
    })
  })
  describe(`Cahier des charges 2022`, () => {
    describe(`Etant donné une demande de délai avec la raison 'délaiCdc2022`, () => {
      describe(`Lorsque l'utilisateur n'est pas 'admin' ou 'dgec-validateur'`, () => {
        it(`Alors une erreur UnauthorizedError devrait être retournée`, async () => {
          fakePublish.mockClear()

          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))

          const shouldUserAccessProject = jest.fn(async () => true)

          const fileRepo = {
            save: jest.fn(),
            load: jest.fn(),
          }

          const signalerDemandeDelai = makeSignalerDemandeDelai({
            fileRepo,
            shouldUserAccessProject,
            projectRepo,
          })

          const res = await signalerDemandeDelai({
            projectId,
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            newCompletionDueOn: new Date('2025-01-31'),
            signaledBy: user,
            raison: 'délaiCdc2022',
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

          expect(fakePublish).not.toHaveBeenCalled()
        })
      })

      describe(`Lorsque le porteur n'a pas choisi le cahier des charges du 30/08/22`, () => {
        it(`Alors une erreur ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError devrait être retournée`, async () => {
          fakePublish.mockClear()

          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

          const shouldUserAccessProject = jest.fn(async () => true)

          const fileRepo = {
            save: jest.fn(),
            load: jest.fn(),
          }

          const cahierDesCharges = { type: 'modifié', paruLe: '30/07/2021' }

          const fakeProject = { ...makeFakeProject(), cahierDesCharges }

          const projectRepo = fakeTransactionalRepo(fakeProject as Project)

          const signalerDemandeDelai = makeSignalerDemandeDelai({
            fileRepo,
            shouldUserAccessProject,
            projectRepo,
          })

          const res = await signalerDemandeDelai({
            projectId,
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            newCompletionDueOn: new Date('2025-01-31'),
            signaledBy: user,
            raison: 'délaiCdc2022',
          })

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(
            ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError
          )

          expect(fakePublish).not.toHaveBeenCalled()
        })
      })
    })
  })
})
