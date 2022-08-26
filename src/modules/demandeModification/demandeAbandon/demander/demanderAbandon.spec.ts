import { Readable } from 'stream'
import { DemanderAbandonError, makeDemanderAbandon } from '@modules/demandeModification'
import { Project } from '@modules/project'
import { Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { AppelOffre } from '@entities'
import { fakeRepo } from '../../../../__tests__/fixtures/aggregates'

describe('Commande demanderAbandon', () => {
  const user = makeFakeUser({ role: 'porteur-projet' })

  const getProjectAppelOffreId = jest.fn(() =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )
  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre)

  const fakeProject = makeFakeProject()

  const fileRepo = {
    save: jest.fn(() => okAsync(null)),
    load: jest.fn(),
  }

  const fakeFileContents = {
    filename: 'fakeFile.pdf',
    contents: Readable.from('test-content'),
  }

  const shouldUserAccessProject = jest.fn(async () => true)

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  beforeEach(() => publishToEventStore.mockClear())

  describe(`Demande d'abandon impossible si le porteur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => false)
      it(`Lorsque le porteur fait une demande d'abandon,
      alors, une erreur est retournée`, async () => {
        const projectRepo = fakeRepo({
          ...fakeProject,
          isClasse: true,
        } as Project)

        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        const requestResult = await demanderAbandon({
          justification: 'justification',
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
  })

  describe(`Demande d'abandon impossible si le projet est éliminé`, () => {
    describe(`Etant donnée un porteur ayant les droits sur un projet éliminé`, () => {
      it(`Lorsque le porteur fait une demande d'abandon,
          et que le projet éliminé,
          alors une erreur de type DemanderAbandonError devrait être émise`, async () => {
        const fakeProject = makeFakeProject()
        const projectRepo = fakeRepo({
          ...fakeProject,
          isClasse: false,
        } as Project)

        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        const requestResult = await demanderAbandon({
          justification: 'justification',
          user,
          projectId: fakeProject.id.toString(),
        })

        expect(requestResult.isErr()).toEqual(true)
        if (requestResult.isOk()) return
        expect(requestResult.error).toBeInstanceOf(DemanderAbandonError)

        expect(fileRepo.save).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Demande d'abandon impossible si le projet est déjà abandonné`, () => {
    describe(`Etant donnée un porteur ayant les droits sur un projet`, () => {
      it(`Lorsque le porteur fait une demande d'abandon,
          et que le projet abandoné,
          alors une erreur de type DemanderAbandonError devrait être émise`, async () => {
        const fakeProject = makeFakeProject()
        const projectRepo = fakeRepo({
          ...fakeProject,
          isClasse: true,
          abandonedOn: new Date('2022-01-01').getTime(),
        } as Project)

        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject: jest.fn(async () => true),
          getProjectAppelOffreId,
          projectRepo,
        })

        const requestResult = await demanderAbandon({
          justification: 'justification',
          user,
          projectId: fakeProject.id.toString(),
        })

        expect(requestResult.isErr()).toEqual(true)
        if (requestResult.isOk()) return
        expect(requestResult.error).toBeInstanceOf(DemanderAbandonError)

        expect(fileRepo.save).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Demande d'abandon possible si le porteur a les droits sur le projet`, () => {
    describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
      } as Project)
      describe(`Enregistrer la demande d'abandon'`, () => {
        describe(`Lorsque le porteur fait une demande d'abandon'`, () => {
          it(`Alors un événement AbandonDemandé devrait être émis`, async () => {
            const demanderAbandon = makeDemanderAbandon({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
              projectRepo,
            })

            await demanderAbandon({
              justification: 'justification',
              user,
              projectId: fakeProject.id.toString(),
            })

            expect(publishToEventStore).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'AbandonDemandé',
                payload: expect.objectContaining({ projetId: fakeProject.id.toString() }),
              })
            )
          })
        })
      })
      describe(`Enregistrer le fichier joint à la demande`, () => {
        describe(`Lorsque le porteur fait une demande d'abandon avec fichier joint`, () => {
          it(`Alors le fichier doit être enregistré`, async () => {
            const demanderAbandon = makeDemanderAbandon({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
              projectRepo,
            })

            await demanderAbandon({
              justification: 'justification',
              user,
              projectId: fakeProject.id.toString(),
              file: fakeFileContents,
            })

            expect(fileRepo.save).toHaveBeenCalledWith(
              expect.objectContaining({ contents: fakeFileContents.contents })
            )
          })
        })
      })
    })
  })

  describe(`Pas de souscription au nouveau cahier des charges si l'AO ne le requiert pas`, () => {
    describe(`Étant donné un projet avec un AO ne requérant pas de choix du nouveau CDC
                  Lorsque le porteur fait une demande de délai
                  et qu'il n'avait pas encore souscri au nouveau cahier des charges`, () => {
      it(`Alors aucun un événement ProjectNewRulesOptedIn ne devrait être émis`, async () => {
        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: false,
          isClasse: true,
        } as Project)

        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        await demanderAbandon({
          user,
          projectId: fakeProject.id.toString(),
        })

        expect(publishToEventStore).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: 'ProjectNewRulesOptedIn' })
        )
      })
    })
  })

  describe(`Enregistrer la souscription au nouveau cahier des charges`, () => {
    describe(`Lorsque le porteur fait une demande de délai
            et qu'il n'avait pas encore souscrit au nouveau cahier des charges`, () => {
      it(`Alors un événement ProjectNewRulesOptedIn devrait être émis en premier`, async () => {
        const projectRepo = fakeRepo({
          ...fakeProject,
          newRulesOptIn: false,
          isClasse: true,
        } as Project)

        const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
          ({
            id: 'appelOffreId',
            choisirNouveauCahierDesCharges: true,
            periodes: [{ id: 'periodeId', type: 'notified' }],
            familles: [{ id: 'familleId' }],
          } as AppelOffre)

        const demanderAbandon = makeDemanderAbandon({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        })

        const res = await demanderAbandon({
          user,
          projectId: fakeProject.id.toString(),
          newRulesOptIn: true,
        })

        console.log('réponse : ', res)

        expect(publishToEventStore).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            type: 'ProjectNewRulesOptedIn',
            payload: { projectId: fakeProject.id.toString(), optedInBy: user.id },
          })
        )

        expect(publishToEventStore).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            type: 'AbandonDemandé',
            payload: expect.objectContaining({
              projetId: fakeProject.id.toString(),
            }),
          })
        )
      })
    })
  })
})
