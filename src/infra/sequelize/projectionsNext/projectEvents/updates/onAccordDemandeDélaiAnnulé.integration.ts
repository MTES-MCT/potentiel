import { UniqueEntityID } from '@core/domain'
import {
  AccordDemandeDélaiAnnulé,
  AccordDemandeDélaiAnnuléPayload,
} from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onAccordDemandeDélaiAnnulé from './onAccordDemandeDélaiAnnulé'

describe('Projecteur de ProjectEvent onAccordDemandeDélaiAnnulé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement AccordDemandeDélaiAnnulé émis`, () => {
    //Scenario 1
    describe(`Lorsqu'il y a un événement du même id dans ProjectEvent`, () => {
      it(`Alors cet événement devrait être mis à jour avec le statut "envoyée"`, async () => {
        const { ModificationRequest } = models
        const demandeDélaiId = new UniqueEntityID().toString()
        const projetId = new UniqueEntityID().toString()
        const dateAchèvementDemandée = new Date().getTime()
        const occurredAt = new Date().getTime()

        const demandeur = new UniqueEntityID().toString()
        const accordéPar = new UniqueEntityID().toString()
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
            statut: 'accordé',
            autorité: 'dreal',
            dateAchèvementDemandée,
            demandeur,
            accordéPar,
          },
        })

        await onAccordDemandeDélaiAnnulé(
          new AccordDemandeDélaiAnnulé({
            payload: {
              demandeDélaiId,
              annuléPar,
            } as AccordDemandeDélaiAnnuléPayload,
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
          eventPublishedAt: requestedOn,
          valueDate: requestedOn,
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
    describe(`Lorsqu'il y a un événement de type "ModificationRequestAccepted" 
      et un événement de type "ModificationRequestInstructionStarted"
      avec le même modificationRequestId que celui de la demande à mettre à jour`, () => {
      it(`Alors ces événements devraient être supprimés 
      pour repasser la demande en statut "envoyé"`, async () => {
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
          type: 'ModificationRequestAccepted',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
            file: { id: 'id-fichier-reponse', name: 'nom-fichier-reponse' },
          },
        })

        await onAccordDemandeDélaiAnnulé(
          new AccordDemandeDélaiAnnulé({
            payload: {
              demandeDélaiId: modificationRequestId,
              annuléPar,
            } as AccordDemandeDélaiAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          })
        )

        const modificationRequestAccepted = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestAccepted', payload: { modificationRequestId } },
        })
        const modificationRequestInstructionStarted = await ProjectEvent.findOne({
          where: {
            type: 'ModificationRequestInstructionStarted',
            payload: { modificationRequestId },
          },
        })

        expect(modificationRequestAccepted).toBeNull()
        expect(modificationRequestInstructionStarted).toBeNull()
      })
    })
  })
})
