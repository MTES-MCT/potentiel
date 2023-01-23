import { okAsync } from '@core/utils'
import { AnnulationAbandonRejetée } from '@modules/demandeModification'
import { makeOnAnnulationAbandonRejetée } from './onAnnulationAbandonRejetée'

describe(`Notifier lorsqu'une annulation d'abandon est rejetée`, () => {
  describe(`Etant donné un projet accessible pour deux porteurs`, () => {
    it(`  Quand une annulation d'abandon est rejetée
          Alors les deux porteurs ayant accès au projet devrait être notifiés`, async () => {
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
          type: 'annulation abandon',
        })

      const onAnnulationAbandonRejetée = makeOnAnnulationAbandonRejetée({
        notifierPorteurChangementStatutDemande,
        getModificationRequestInfoForStatusNotification,
      })

      await onAnnulationAbandonRejetée(
        new AnnulationAbandonRejetée({
          payload: {
            demandeId: 'la-demande',
            projetId: 'le-projet',
            rejetéPar: 'la-dreal',
            fichierRéponseId: 'le-fichier',
          },
        })
      )

      expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2)
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: 'porteur1@test.test',
          status: 'rejetée',
          fullName: 'Porteur de projet 1',
          porteurId: 'porteur-1',
          typeDemande: 'annulation abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        })
      )

      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: 'porteur2@test.test',
          status: 'rejetée',
          fullName: 'Porteur de projet 2',
          porteurId: 'porteur-2',
          typeDemande: 'annulation abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        })
      )
    })
  })
})
