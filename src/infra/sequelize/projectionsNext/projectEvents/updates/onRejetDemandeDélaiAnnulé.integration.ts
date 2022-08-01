import { UniqueEntityID } from '@core/domain'
import {
  RejetDemandeDélaiAnnulé,
  RejetDemandeDélaiAnnuléPayload,
} from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onRejetDemandeDélaiAnnulé from './onRejetDemandeDélaiAnnulé'

describe('Projecteur de ProjectEvent onRejetDemandeDélaiAnnulé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement RejetDemandeDélaiAnnulé émis`, () => {
    //Scenario 1
    describe(`Lorsqu'il y a un événement du même id dans ProjectEvent`, () => {
      it(`Alors cet événement devrait être mis à jour avec le statut "envoyée"`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const dateAchèvementDemandée = new Date().getTime()
        const occurredAt = new Date().getTime()

        const demandeur = new UniqueEntityID().toString()
        const rejetéPar = new UniqueEntityID().toString()
        const annuléPar = new UniqueEntityID().toString()

        await ProjectEvent.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            statut: 'rejetée',
            autorité: 'dreal',
            dateAchèvementDemandée,
            demandeur,
            rejetéPar,
          },
        })

        await onRejetDemandeDélaiAnnulé(
          new RejetDemandeDélaiAnnulé({
            payload: {
              demandeDélaiId,
              annuléPar,
            } as RejetDemandeDélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId },
        })
        expect(DemandeDélai).toMatchObject({
          type: 'DemandeDélai',
          payload: {
            statut: 'envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée,
            demandeur,
          },
        })
      })
    })

    //Scenario 2
    describe(`Lorsqu'il y a un événement de type "ModificationRequestRejected" 
      avec le même modificationRequestId`, () => {
      it(`Alors cet événement devrait être supprimé`, async () => {
        const modificationRequestId = new UniqueEntityID().toString()
        const projectId = new UniqueEntityID().toString()
        const dateAchèvementDemandée = new Date().getTime()
        const occurredAt = new Date().getTime()

        const demandeur = new UniqueEntityID().toString()
        const annuléPar = new UniqueEntityID().toString()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationType: 'delai',
            modificationRequestId,
            authority: 'dreal',
            delayInMonths: 3,
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestRejected',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
            file: { id: 'id-fichier-reponse', name: 'nom-fichier-reponse' },
          },
        })

        await onRejetDemandeDélaiAnnulé(
          new RejetDemandeDélaiAnnulé({
            payload: {
              demandeDélaiId: modificationRequestId,
              annuléPar,
            } as RejetDemandeDélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          })
        )

        const modificationRequestRejected = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestRejected', payload: { modificationRequestId } },
        })

        expect(modificationRequestRejected).toBeNull()
      })
    })
  })
})
