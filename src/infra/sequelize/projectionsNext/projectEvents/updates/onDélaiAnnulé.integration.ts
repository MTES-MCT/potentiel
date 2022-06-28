import { UniqueEntityID } from '@core/domain'
import { DélaiAnnulé, DélaiAnnuléPayload } from '@modules/modificationRequest'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiAnnulé from './onDélaiAnnulé'

describe('Projecteur de ProjectEvent onDélaiAnnulé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement DélaiAnnulé émis`, () => {
    // Scenario 1
    describe(`Lorsqu'il n'y a pas d'événement demandeDélai du même id dans ProjectEvent`, () => {
      it(`Alors, un nouvel événement de type demandeDélai devrait être ajouté dans la projection`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()

        await onDélaiAnnulé(
          new DélaiAnnulé({
            payload: {
              demandeDélaiId,
              annuléPar: new UniqueEntityID().toString(),
              projetId,
            } as DélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-28'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId, projectId: projetId },
        })
        expect(DemandeDélai).not.toBeNull()
        expect(DemandeDélai).toMatchObject({
          type: 'DemandeDélai',
          payload: { statut: 'annulée' },
        })
      })
    })
    // Scenario 2
    describe(`Lorsqu'il y a un événement du même id dans ProjectEvent`, () => {
      it(`Alors cet événement devrait être mis à jour avec le statut "annulée"`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const date = new Date()

        await ProjectEvent.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            statut: 'demande-envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée: date.getTime(),
            demandeur: new UniqueEntityID().toString(),
          },
        })

        await onDélaiAnnulé(
          new DélaiAnnulé({
            payload: {
              demandeDélaiId,
              annuléPar: new UniqueEntityID().toString(),
              projetId,
            } as DélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-28'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId, projectId: projetId },
        })
        expect(DemandeDélai).not.toBeNull()
        expect(DemandeDélai).toMatchObject({
          type: 'DemandeDélai',
          payload: { statut: 'annulée' },
        })
      })
    })
  })
})
