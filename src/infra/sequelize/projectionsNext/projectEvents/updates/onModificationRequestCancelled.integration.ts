import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestCancelled from './onModificationRequestCancelled'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'

const { ModificationRequest } = models

describe('handler onModificationRequestCancelled', () => {
  const projectId = new UniqueEntityID().toString()
  const demandeId = new UniqueEntityID().toString()
  const utilisateurId = new UniqueEntityID().toString()
  const uneDate = new Date('2022-01-01').getTime()
  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Traitement des événements de type 'délai'`, () => {
    describe(`Etant donné un événement de type ModificationRequestCancelled de sous-type 'delai' émis`, () => {
      const nouvelEvénementEmis = new ModificationRequestCancelled({
        payload: {
          modificationRequestId: demandeId,
          cancelledBy: utilisateurId,
        },
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
      describe(`S'il y a un événement de type DemandeDélai de même id dans ProjectEvent`, () => {
        it(`Alors le statut de cet événement devrait être mis à jour pour passer en "annulé"`, async () => {
          /* On présume qu'il y a un événement de type délai dans la table ModificationRequest 
        associée à la demande par son id 
        */
          await ModificationRequest.create(
            makeFakeModificationRequest({
              id: demandeId,
              projectId,
              type: 'delai',
              status: 'envoyée',
            })
          )

          // l'événement déjà présent dans ProjectEvent
          await ProjectEvent.create({
            id: demandeId,
            projectId,
            type: 'DemandeDélai',
            valueDate: uneDate,
            eventPublishedAt: uneDate,
            payload: {
              statut: 'envoyée',
              autorité: 'dreal',
              dateAchèvementDemandée: uneDate,
              demandeur: utilisateurId,
            },
          })

          await onModificationRequestCancelled(nouvelEvénementEmis)

          const demandeDélai = await ProjectEvent.findOne({ where: { id: demandeId } })

          expect(demandeDélai).toMatchObject({
            id: demandeId,
            projectId,
            type: 'DemandeDélai',
            valueDate: new Date('2022-02-09').getTime(),
            eventPublishedAt: new Date('2022-02-09').getTime(),
            payload: {
              statut: 'annulée',
              autorité: 'dreal',
              dateAchèvementDemandée: uneDate,
              annuléPar: utilisateurId,
              demandeur: utilisateurId,
            },
          })
        })
      })

      describe(`S'il n'y a pas d'événement de type DemandeDélai de même id dans ProjectEvent`, () => {
        it(`Aucun événement ne doit être ajouté à ProjectEvent`, async () => {
          /* On présume qu'il y a un événement de type délai dans la table ModificationRequest 
        associée à la demande par son id 
        */
          await ModificationRequest.create(
            makeFakeModificationRequest({
              id: demandeId,
              projectId,
              type: 'delai',
              status: 'envoyée',
            })
          )

          await onModificationRequestCancelled(nouvelEvénementEmis)

          const DemandeDélai = await ProjectEvent.findOne({
            where: { id: demandeId },
          })
          expect(DemandeDélai).toBeNull()
        })
      })
    })
  })

  describe(`Traitement des événement qui ne sont pas de type 'délai'`, () => {
    describe(`Etant donné un événement ModificationRequestCancelled émis`, () => {
      it('Alors un nouvel événement de type ModificationRequestCancelled devrait être ajouté à ProjectEvent', async () => {
        await ModificationRequest.create(makeFakeModificationRequest({ id: demandeId, projectId }))
        await onModificationRequestCancelled(
          new ModificationRequestCancelled({
            payload: {
              modificationRequestId: demandeId,
              cancelledBy: utilisateurId,
            },
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequestCancelled',
          projectId,
          payload: { modificationRequestId: demandeId },
        })
      })
    })
  })
})
