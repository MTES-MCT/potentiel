import { okAsync } from '@core/utils'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'
import { makeOnRejetChangementDePuissanceAnnulé } from './onRejetChangementDePuissanceAnnulé'

describe(`Notifier lors de l'annulation du rejet d'une demande de changement de puissance`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`  Quand un rejet d'une demande de changement de puissance est annulé,
          alors tous les porteurs ayant accès au projet devrait être notifiés`, async () => {
      const sendNotification = jest.fn()
      const getModificationRequestInfoForStatusNotification = () =>
        okAsync({
          porteursProjet: [
            {
              role: 'porteur-projet',
              id: 'porteur-1',
              email: 'porteur1@test.test',
              fullName: 'Porteur de projet 1',
            },
            {
              role: 'porteur-projet',
              id: 'porteur-2',
              email: 'porteur2@test.test',
              fullName: 'Porteur de projet 2',
            },
          ],
          nomProjet: 'nom-du-projet',
          regionProjet: 'region',
          departementProjet: 'departement',
          type: 'recours',
        })

      const onRejetDemandeChangementDePuissanceAnnulé = makeOnRejetChangementDePuissanceAnnulé({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
      })

      await onRejetDemandeChangementDePuissanceAnnulé(
        new RejetChangementDePuissanceAnnulé({
          payload: {
            demandeChangementDePuissanceId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'la-dreal',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(2)
      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur1@test.test',
          }),
          variables: expect.objectContaining({
            status: 'repassée en statut "envoyée"',
            nom_projet: 'nom-du-projet',
            type_demande: 'recours',
          }),
        })
      )
      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur2@test.test',
          }),
          variables: expect.objectContaining({
            status: 'repassée en statut "envoyée"',
            nom_projet: 'nom-du-projet',
            type_demande: 'recours',
          }),
        })
      )
    })
  })
})
