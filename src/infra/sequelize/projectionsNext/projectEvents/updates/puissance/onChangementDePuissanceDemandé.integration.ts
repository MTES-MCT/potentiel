import { UniqueEntityID } from '@core/domain'
import {
  ChangementDePuissanceDemandé,
  ChangementDePuissanceDemandéPayload,
} from '@modules/demandeModification'
import { ProjectEvent } from '../../projectEvent.model'
import onChangementDePuissanceDemandé from './onChangementDePuissanceDemandé'

describe('Projecteur de ProjectEvent onChangementDePuissanceDemandé', () => {
  describe(`Création de la demande de changement de puissance dans la frise`, () => {
    it(`Lorsqu'on émet un événement ChangementDePuissanceDemandé
        Alors une nouvelle entrée de type "ChangementDePuissanceDemandé" avec un statut "envoyée" devrait être enregistrée.`, async () => {
      const demandeChangementDePuissanceId = new UniqueEntityID().toString()
      const projetId = new UniqueEntityID().toString()

      await onChangementDePuissanceDemandé(
        new ChangementDePuissanceDemandé({
          payload: {
            demandeChangementDePuissanceId,
            projetId,
            autorité: 'dreal',
            fichierId: 'id-fichier',
            justification: 'en retard',
            puissance: 10,
          } as ChangementDePuissanceDemandéPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-06-25'),
          },
        })
      )

      const résultat = await ProjectEvent.findOne({ where: { projectId: projetId } })

      expect(résultat).not.toBeNull()
      expect(résultat).toMatchObject({
        type: 'ChangementDePuissanceDemandé',
        payload: {
          modificationRequestId: demandeChangementDePuissanceId,
          statut: 'envoyée',
        },
      })
    })
  })
})
