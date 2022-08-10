import { UniqueEntityID } from '@core/domain'
import { DélaiDemandé, DélaiDemandéPayload } from '@modules/demandeModification'
import { ProjectEvent } from '../projectEvent.model'
import onDélaiDemandé from './onDélaiDemandé'

describe('Projecteur de ProjectEvent onDélaiDemandé', () => {
  describe(`Création de la demande de délai dans la frise`, () => {
    it(`Lorsqu'on émet un événement DélaiDemandé
        Alors une nouvelle entrée de type "DemandeDélai" avec un statut "envoyée" devrait être enregistrée.`, async () => {
      const demandeDélaiId = new UniqueEntityID().toString()
      const projetId = new UniqueEntityID().toString()

      await onDélaiDemandé(
        new DélaiDemandé({
          payload: {
            demandeDélaiId: demandeDélaiId,
            projetId: projetId,
            autorité: 'dreal',
            fichierId: 'id-fichier',
            justification: 'en retard',
            dateAchèvementDemandée: new Date('2022-06-25').toISOString(),
            porteurId: new UniqueEntityID().toString(),
          } as DélaiDemandéPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-06-25'),
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        id: demandeDélaiId,
        type: 'DemandeDélai',
        payload: {
          statut: 'envoyée',
        },
      })
    })
  })
  describe(`Mise à jour de la demande de délai dans la frise`, () => {
    it(`Étant donné une demande de délai déjà existante avec un délai en mois
        Lorsqu'on émet un événement DélaiDemandé pour cette même demande
        Alors une nouvelle entrée de type "DemandeDélai" avec une date d'achèvement demandée devrait être enregistrée.`, async () => {
      const demandeDélaiId = new UniqueEntityID().toString()
      const projetId = new UniqueEntityID().toString()

      await ProjectEvent.create({
        id: demandeDélaiId,
        projectId: projetId,
        type: 'DemandeDélai',
        valueDate: new Date('2022-06-25').getTime(),
        eventPublishedAt: new Date('2022-06-25').getTime(),
        payload: {
          statut: 'envoyée',
          autorité: 'dreal',
          délaiEnMoisDemandé: 7,
          demandeur: 'porteur-id',
        },
      })

      await onDélaiDemandé(
        new DélaiDemandé({
          payload: {
            demandeDélaiId: demandeDélaiId,
            projetId: projetId,
            autorité: 'dreal',
            fichierId: 'id-fichier',
            justification: 'en retard',
            dateAchèvementDemandée: new Date('2022-06-25').toISOString(),
            porteurId: new UniqueEntityID().toString(),
          } as DélaiDemandéPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-06-25'),
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        id: demandeDélaiId,
        type: 'DemandeDélai',
        payload: {
          statut: 'envoyée',
          dateAchèvementDemandée: new Date('2022-06-25').toISOString(),
        },
      })
    })
  })
})
