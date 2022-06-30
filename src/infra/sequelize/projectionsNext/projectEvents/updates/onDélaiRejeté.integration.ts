import { UniqueEntityID } from '@core/domain'
import { DélaiRejeté, DélaiRejetéPayload } from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiRejeté from './onDélaiRejeté'

describe('Projecteur de ProjectEvent onDélaiRejeté', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement DélaiRejeté émis`, () => {
    // Scenario 1
    describe(`Lorsqu'il n'y a pas d'événement demandeDélai du même id dans ProjectEvent`, () => {
      it(`Alors, aucun événement ne devrait être ajouté à ProjectEvent`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()

        await onDélaiRejeté(
          new DélaiRejeté({
            payload: {
              demandeDélaiId,
              rejetéPar: new UniqueEntityID().toString(),
            } as DélaiRejetéPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-28'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId },
        })
        expect(DemandeDélai).toBeNull()
      })
    })
    //Scenario 2
    describe(`Lorsqu'il y a un événement du même id dans ProjectEvent`, () => {
      it(`Alors cet événement devrait être mis à jour avec le statut "rejetée"`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const dateAchèvementDemandée = new Date().getTime()
        const occurredAt = new Date().getTime()

        await ProjectEvent.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            statut: 'envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée,
            demandeur: new UniqueEntityID().toString(),
          },
        })

        await onDélaiRejeté(
          new DélaiRejeté({
            payload: {
              demandeDélaiId,
              rejetéPar: new UniqueEntityID().toString(),
            } as DélaiRejetéPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-28'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId },
        })
        expect(DemandeDélai).toMatchObject({
          type: 'DemandeDélai',
          payload: { statut: 'rejetée', dateAchèvementDemandée, demandeDélaiId },
        })
      })
    })
  })
})
