import { okAsync } from '@core/utils'
import { AnnulationAbandonAccordée } from '@modules/demandeModification'
import { makeOnAnnulationAbandonAccordée } from './onAnnulationAbandonAccordée'

describe(`Notifier lorsqu'une annulation d'abandon est accordée`, () => {
  describe(`Etant donné un projet accessible pour deux porteurs`, () => {
    it(`  Quand une annulation  d'abandon est accordé
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

      const onAnnulationAbandonAccordée = makeOnAnnulationAbandonAccordée({
        notifierPorteurChangementStatutDemande,
        getModificationRequestInfoForStatusNotification,
      })

      await onAnnulationAbandonAccordée(
        new AnnulationAbandonAccordée({
          payload: {
            demandeId: 'la-demande',
            projetId: 'le-projet',
            accordéPar: 'la-dreal',
            fichierRéponseId: 'le-fichier',
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
          status: 'acceptée',
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
