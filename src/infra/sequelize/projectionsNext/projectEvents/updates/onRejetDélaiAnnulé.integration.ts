import { UniqueEntityID } from '@core/domain'
import { RejetDélaiAnnulé, RejetDélaiAnnuléPayload } from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onRejetDélaiAnnulé from './onRejetDélaiAnnulé'

describe('Projecteur de ProjectEvent onRejetDélaiAnnulé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement RejetDélaiAnnulé émis`, () => {
    //Scenario 1
    describe(`Lorsqu'il y a un événement du même id dans ProjectEvent`, () => {
      it(`Alors cet événement devrait être mis à jour avec le statut "envoyée"`, async () => {
        const { ModificationRequest } = models
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const dateAchèvementDemandée = new Date().getTime()
        const occurredAt = new Date().getTime()
        const demandeur = new UniqueEntityID().toString()
        const rejetéPar = new UniqueEntityID().toString()
        const annuléPar = new UniqueEntityID().toString()
        const requestedOn = new Date('2021-01-01').getTime()

        await ModificationRequest.create({
          id: demandeDélaiId,
          projectId: projetId,
          type: 'delai',
          requestedOn,
          status: 'acceptée',
        })

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

        await onRejetDélaiAnnulé(
          new RejetDélaiAnnulé({
            payload: {
              demandeDélaiId,
              annuléPar,
            } as RejetDélaiAnnuléPayload,
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
          valueDate: requestedOn,
          eventPublishedAt: requestedOn,
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
      et un événement de type "ModificationRequestInstructionStarted"
      avec le même modificationRequestId`, () => {
      it(`Alors ces événements devraient être supprimés`, async () => {
        const modificationRequestId = new UniqueEntityID().toString()
        const projectId = new UniqueEntityID().toString()
        const occurredAt = new Date().getTime()

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
          type: 'ModificationRequestInstructionStarted',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
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

        await onRejetDélaiAnnulé(
          new RejetDélaiAnnulé({
            payload: {
              demandeDélaiId: modificationRequestId,
              annuléPar,
            } as RejetDélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          })
        )

        const modificationRequestRejected = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestRejected', payload: { modificationRequestId } },
        })
        const modificationRequestInstruction = await ProjectEvent.findOne({
          where: {
            type: 'ModificationRequestInstructionStarted',
            payload: { modificationRequestId },
          },
        })

        expect(modificationRequestRejected).toBeNull()
        expect(modificationRequestInstruction).toBeNull()
      })
    })
  })
})
