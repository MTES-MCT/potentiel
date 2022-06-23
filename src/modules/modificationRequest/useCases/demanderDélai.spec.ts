import { Readable } from 'stream'
import { DélaiDemandé } from '@modules/modificationRequest'
import { NumeroGestionnaireSubmitted, ProjectNewRulesOptedIn, Project } from '@modules/project'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeDemanderDélai } from './demanderDelai'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'

describe('Commande demanderDélai', () => {
  const user = makeFakeUser({ role: 'porteur-projet' })

  const getProjectAppelOffreId = jest.fn((projectId) =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )
  const appelOffreRepo = {
    findById: async () => [
      {
        id: 'appelOffreId',
        periodes: [{ id: 'periodeId', type: 'notified' }],
        familles: [{ id: 'familleId' }],
      },
    ],
  } as unknown as AppelOffreRepo

  const fakeProject = makeFakeProject()

  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  }

  const fakeFileContents = {
    filename: 'fakeFile.pdf',
    contents: Readable.from('test-content'),
  }

  // Scenario 1
  describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    it(`Lorsque le porteur fait une demande de délai,
      alors, une erreur est retournée`, async () => {
      const publishToEventStore = jest.fn((event: DomainEvent) =>
        okAsync<null, InfraNotAvailableError>(null)
      )

      const projectRepo = fakeRepo({
        ...fakeProject,
        newRulesOptIn: true,
      } as Project)

      const demandeDelai = makeDemanderDélai({
        fileRepo,
        appelOffreRepo,
        publishToEventStore,
        shouldUserAccessProject,
        getProjectAppelOffreId,
        projectRepo,
      })

      const requestResult = await demandeDelai({
        justification: 'justification',
        dateAchèvementDemandée: new Date('2022-01-01'),
        file: fakeFileContents,
        user,
        projectId: fakeProject.id.toString(),
      })

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: fakeProject.id.toString(),
      })

      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(requestResult.isErr()).toEqual(true)
      if (requestResult.isOk()) return
      expect(requestResult.error).toBeInstanceOf(UnauthorizedError)
    })
  })
  // Scenario 2
  describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => true)
    describe(`Lorsque le porteur fait une demande de délai`, () => {
      it(`Alors un événement DélaiDemandé devrait être émis`, async () => {
        const publishToEventStore = jest.fn((event: DomainEvent) =>
          okAsync<null, InfraNotAvailableError>(null)
        )

        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: true,
        } as Project)

        const demandeDelai = makeDemanderDélai({
          fileRepo: fileRepo as Repository<FileObject>,
          appelOffreRepo,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        await demandeDelai({
          justification: 'justification',
          dateAchèvementDemandée: new Date('2022-01-01'),
          user,
          projectId: fakeProject.id.toString(),
        })

        const firstEvent = publishToEventStore.mock.calls[0][0]
        expect(firstEvent).toBeInstanceOf(DélaiDemandé)
        expect(firstEvent.payload).toMatchObject({
          dateAchèvementDemandée: new Date('2022-01-01'),
          projetId: fakeProject.id.toString(),
        })
      })
    })
    describe(`Lorsque le porteur fait une demande de délai avec fichier joint`, () => {
      it(`Alors le fichier doit être enregistré`, async () => {
        const publishToEventStore = jest.fn((event: DomainEvent) =>
          okAsync<null, InfraNotAvailableError>(null)
        )
        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: true,
        } as Project)

        const demandeDelai = makeDemanderDélai({
          fileRepo: fileRepo as Repository<FileObject>,
          appelOffreRepo,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        await demandeDelai({
          justification: 'justification',
          dateAchèvementDemandée: new Date('2022-01-01'),
          user,
          projectId: fakeProject.id.toString(),
          file: fakeFileContents,
        })

        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(fakeFile).toBeDefined()
      })
    })
    describe(`Lorsque le porteur fait une demande de délai avec numéro de gestionnaire`, () => {
      it(`Alors un événement NumeroGestionnaireSubmitted doit être émis`, async () => {
        const publishToEventStore = jest.fn((event: DomainEvent) =>
          okAsync<null, InfraNotAvailableError>(null)
        )

        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: true,
        } as Project)

        const demandeDelai = makeDemanderDélai({
          fileRepo: fileRepo as Repository<FileObject>,
          appelOffreRepo,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })
        await demandeDelai({
          justification: 'justification',
          dateAchèvementDemandée: new Date('2022-01-01'),
          user,
          projectId: fakeProject.id.toString(),
          numeroGestionnaire: 'IdGestionnaire',
        })

        const secondEvent = publishToEventStore.mock.calls[1][0]
        expect(secondEvent).toBeInstanceOf(NumeroGestionnaireSubmitted)
        expect(secondEvent.payload).toMatchObject({
          numeroGestionnaire: 'IdGestionnaire',
          submittedBy: user.id,
          projectId: fakeProject.id.toString(),
        })
      })
    })
    describe(`Lorsque le porteur fait une demande de délai
            et qu'il n'avait pas encore souscri au nouveau cahier des charges`, () => {
      it(`Alors un événement ProjectNewRulesOptedIn devrait être émis en premier`, async () => {
        const publishToEventStore = jest.fn((event: DomainEvent) =>
          okAsync<null, InfraNotAvailableError>(null)
        )

        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: false,
        } as Project)

        const demandeDelai = makeDemanderDélai({
          fileRepo: fileRepo as Repository<FileObject>,
          appelOffreRepo,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })
        await demandeDelai({
          justification: 'justification',
          dateAchèvementDemandée: new Date('2022-01-01'),
          user,
          projectId: fakeProject.id.toString(),
        })

        const firstEvent = publishToEventStore.mock.calls[0][0]
        expect(firstEvent).toBeInstanceOf(ProjectNewRulesOptedIn)
        expect(firstEvent.payload).toMatchObject({
          projectId: fakeProject.id.toString(),
          optedInBy: user.id,
        })

        const secondEvent = publishToEventStore.mock.calls[1][0]
        expect(secondEvent).toBeInstanceOf(DélaiDemandé)
        expect(secondEvent.payload).toMatchObject({
          dateAchèvementDemandée: new Date('2022-01-01'),
          projetId: fakeProject.id.toString(),
        })
      })
    })
  })
})
