import { okAsync } from '@core/utils'
import { AbandonAccordé } from '@modules/demandeModification'
import { makeOnAbandonAccordé } from '../demandeAbandon'

describe(`Notifier lorsqu'un abandon est accordé`, () => {
  describe(`Etant donné un projet accessible pour deux porteurs`, () => {
    it(`  Quand un abandon est accordé
          Alors les deux porteurs ayant accès au projet devrait être notifié`, async () => {
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
          type: 'abandon',
        })

      const onAbandonAccordé = makeOnAbandonAccordé({
        notifierPorteurChangementStatutDemande,
        getModificationRequestInfoForStatusNotification,
      })

      await onAbandonAccordé(
        new AbandonAccordé({
          payload: {
            demandeAbandonId: 'la-demande',
            projetId: 'le-projet',
            accordéPar: 'la-dreal',
          },
        })
      )

      expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2)
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: 'porteur1@test.test',
          status: 'acceptée',
          fullName: 'Porteur de projet 1',
          porteurId: 'porteur-1',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        })
      )

      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: 'porteur2@test.test',
          status: 'acceptée',
          fullName: 'Porteur de projet 2',
          porteurId: 'porteur-2',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        })
      )
    })
  })
})
