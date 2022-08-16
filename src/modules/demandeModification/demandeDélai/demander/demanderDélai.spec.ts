import { Readable } from 'stream'
import { DélaiDemandé } from '@modules/demandeModification'
import { NumeroGestionnaireSubmitted, ProjectNewRulesOptedIn, Project } from '@modules/project'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { makeDemanderDélai } from './demanderDelai'
import { AppelOffreRepo } from '@dataAccess/inMemory'
import { fakeRepo } from '../../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { DemanderDateAchèvementAntérieureDateThéoriqueError } from '.'
import { AppelOffre } from '@entities'

describe('Commande demanderDélai', () => {
  const user = makeFakeUser({ role: 'porteur-projet' })

  const getProjectAppelOffreId = jest.fn(() =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId')
  )
  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      choisirNouveauCahierDesCharges: true,
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

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))

  const projectRepo = fakeRepo({
    ...fakeProject,
    newRulesOptIn: true,
  } as Project)

  beforeEach(() => {
    publishToEventStore.mockClear()
  })

  describe(`Demande de délai impossible si le porteur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => false)
      it(`Lorsque le porteur fait une demande de délai,
      alors, une erreur est retournée`, async () => {
        const demandeDelai = makeDemanderDélai({
          fileRepo,
          findAppelOffreById,
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
  })

  describe(`Demande de délai impossible si la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement`, () => {
    const shouldUserAccessProject = jest.fn(async () => true)
    const projectRepo = fakeRepo(
      makeFakeProject({ completionDueOn: new Date('2022-01-01').getTime() })
    )
    const demandeDelai = makeDemanderDélai({
      fileRepo,
      findAppelOffreById,
      publishToEventStore,
      shouldUserAccessProject,
      getProjectAppelOffreId,
      projectRepo,
    })

    it(`Lorsque la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement, alors une erreur est retournée`, async () => {
      const resultat = await demandeDelai({
        justification: 'justification',
        dateAchèvementDemandée: new Date('2021-01-01'),
        file: fakeFileContents,
        user,
        projectId: fakeProject.id.toString(),
      })

      expect(resultat.isErr()).toEqual(true)
      const erreurActuelle = resultat._unsafeUnwrapErr()
      expect(erreurActuelle).toBeInstanceOf(DemanderDateAchèvementAntérieureDateThéoriqueError)
      expect(publishToEventStore).not.toHaveBeenCalled()
      expect(fileRepo.save).not.toHaveBeenCalled()
    })

    it(`Lorsque la date limite d'achèvement souhaitée est égale à la date théorique d'achèvement, alors une erreur est retournée`, async () => {
      const resultat = await demandeDelai({
        justification: 'justification',
        dateAchèvementDemandée: new Date('2022-01-01'),
        file: fakeFileContents,
        user,
        projectId: fakeProject.id.toString(),
      })

      expect(resultat.isErr()).toEqual(true)
      const erreurActuelle = resultat._unsafeUnwrapErr()
      expect(erreurActuelle).toBeInstanceOf(DemanderDateAchèvementAntérieureDateThéoriqueError)
      expect(publishToEventStore).not.toHaveBeenCalled()
      expect(fileRepo.save).not.toHaveBeenCalled()
    })
  })

  describe(`Demande de délai possible si le porteur a les droits sur le projet`, () => {
    describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      describe(`Enregistrer la demande de délai`, () => {
        describe(`Lorsque le porteur fait une demande de délai`, () => {
          it(`Alors un événement DélaiDemandé devrait être émis`, async () => {
            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
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

            expect(publishToEventStore).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'DélaiDemandé',
                payload: expect.objectContaining({
                  dateAchèvementDemandée: new Date('2022-01-01').toISOString(),
                  projetId: fakeProject.id.toString(),
                }),
              })
            )
          })
        })
      })
      describe(`Enregistrer le fichier joint à la demande`, () => {
        describe(`Lorsque le porteur fait une demande de délai avec fichier joint`, () => {
          it(`Alors le fichier doit être enregistré`, async () => {
            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
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

            expect(fileRepo.save).toHaveBeenCalledWith(
              expect.objectContaining({ contents: fakeFileContents.contents })
            )
          })
        })
      })
      describe(`Enregistrer le numéro de gestionnaire`, () => {
        describe(`Lorsque le porteur saisit numéro de gestionnaire`, () => {
          it(`Alors un événement NumeroGestionnaireSubmitted doit être émis`, async () => {
            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
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

            expect(publishToEventStore).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                type: 'NumeroGestionnaireSubmitted',
                payload: expect.objectContaining({
                  numeroGestionnaire: 'IdGestionnaire',
                  submittedBy: user.id,
                  projectId: fakeProject.id.toString(),
                }),
              })
            )
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
            } as Project)

            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById: async () => {
                return {
                  id: 'appelOffreId',
                  periodes: [{ id: 'periodeId', type: 'notified' }],
                  familles: [{ id: 'familleId' }],
                } as AppelOffre
              },

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

            expect(publishToEventStore).not.toHaveBeenCalledWith(
              expect.objectContaining({ type: 'ProjectNewRulesOptedIn' })
            )
          })
        })
      })
      describe(`Enregistrer la souscription au nouveau cahier des charges`, () => {
        describe(`Lorsque le porteur fait une demande de délai
            et qu'il n'avait pas encore souscri au nouveau cahier des charges`, () => {
          it(`Alors un événement ProjectNewRulesOptedIn devrait être émis en premier`, async () => {
            const projectRepo = fakeRepo({
              ...fakeProject,
              newRulesOptIn: false,
            } as Project)

            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
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
                type: 'DélaiDemandé',
                payload: expect.objectContaining({
                  dateAchèvementDemandée: new Date('2022-01-01').toISOString(),
                  projetId: fakeProject.id.toString(),
                }),
              })
            )
          })
        })
      })
    })
  })
})
