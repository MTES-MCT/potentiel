import { UniqueEntityID } from '@core/domain'
import { DélaiRefusé, DélaiRefuséPayload } from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiRefusé from './onDélaiRejeté'

describe('Projecteur de ProjectEvent onDélaiRefusé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement DélaiRefusé émis`, () => {
    // Scenario 1
    describe(`Lorsqu'il n'y a pas d'événement demandeDélai du même id dans ProjectEvent`, () => {
      it(`Alors, aucun événement ne devrait être ajouté à ProjectEvent`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()

        await onDélaiRefusé(
          new DélaiRefusé({
            payload: {
              demandeDélaiId,
              refuséPar: new UniqueEntityID().toString(),
            } as DélaiRefuséPayload,
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
            statut: 'envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée: date.getTime(),
            demandeur: new UniqueEntityID().toString(),
          },
        })

        await onDélaiRefusé(
          new DélaiRefusé({
            payload: {
              demandeDélaiId,
              refuséPar: new UniqueEntityID().toString(),
            } as DélaiRefuséPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-28'),
            },
          })
        )

        const DemandeDélai = await ProjectEvent.findOne({
          where: { id: demandeDélaiId },
        })
        expect(DemandeDélai).not.toBeNull()
        expect(DemandeDélai).toMatchObject({
          type: 'DemandeDélai',
          payload: { statut: 'rejetée', dateAchèvementDemandée: date.getTime() },
        })
      })
    })
  })
})
