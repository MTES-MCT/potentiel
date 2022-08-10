import { UniqueEntityID } from '@core/domain'
import { DélaiEnInstructionPayload, DélaiEnInstruction } from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiEnInstruction from './onDélaiEnInstruction'

describe('Projecteur de ProjectEvent onDélaiEnInstruction', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement DélaiEnInstruction émis`, () => {
    // Scenario 1
    describe(`Lorsqu'il n'y a pas d'événement demandeDélai du même id dans ProjectEvent`, () => {
      it(`Alors, aucun événement ne devrait être ajouté à ProjectEvent`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()

        await onDélaiEnInstruction(
          new DélaiEnInstruction({
            payload: {
              demandeDélaiId,
              modifiéPar: new UniqueEntityID().toString(),
              projetId,
            } as DélaiEnInstructionPayload,
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
      it(`Alors cet événement devrait être mis à jour avec le statut "en-instruction"`, async () => {
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const date = new Date()
        const dateAchèvementDemandée = new Date().getTime()
        const demandeur = new UniqueEntityID().toString()
        const modifiéPar = new UniqueEntityID().toString()

        // 1 - On insère la demande initiale dans la projection
        await ProjectEvent.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            statut: 'envoyée',
            autorité: 'dreal',
            dateAchèvementDemandée,
            demandeur,
          },
        })

        // 2 - On appelle le projecteur
        await onDélaiEnInstruction(
          new DélaiEnInstruction({
            payload: {
              demandeDélaiId,
              modifiéPar,
            } as DélaiEnInstructionPayload,
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
          payload: {
            statut: 'en-instruction',
            modifiéPar,
          },
        })
      })
    })
  })
})
