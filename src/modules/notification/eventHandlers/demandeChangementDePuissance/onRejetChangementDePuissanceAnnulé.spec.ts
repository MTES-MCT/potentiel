import { okAsync } from '@core/utils'
import { RejetChangementDePuissanceAnnulé } from '@modules/demandeModification'
import { makeOnRejetChangementDePuissanceAnnulé } from './onRejetChangementDePuissanceAnnulé'

describe(`Notifier lors de l'annulation du rejet d'une demande de changement de puissance`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`  Quand un rejet d'une demande de changement de puissance est annulé,
          alors tous les porteurs ayant accès au projet devrait être notifiés`, async () => {
      const notifierPorteurChangementStatutDemande = jest.fn()
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
          type: 'puissance',
        })

      const onRejetDemandeChangementDePuissanceAnnulé = makeOnRejetChangementDePuissanceAnnulé({
        notifierPorteurChangementStatutDemande,
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

      expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2)
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: 'porteur1@test.test',
          status: 'repassée en statut "envoyée"',
          fullName: 'Porteur de projet 1',
          porteurId: 'porteur-1',
          typeDemande: 'puissance',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: false,
        })
      )
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: 'porteur2@test.test',
          status: 'repassée en statut "envoyée"',
          fullName: 'Porteur de projet 2',
          porteurId: 'porteur-2',
          typeDemande: 'puissance',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: false,
        })
      )
    })
  })
})
