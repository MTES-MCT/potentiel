import { okAsync } from '@core/utils';
import { AbandonDemandé } from '@modules/demandeModification';
import { makeOnAbandonDemandé } from '.';

describe(`Notifier lorsqu'un abandon est demandé`, () => {
  describe(`Etant donné un projet accessible pour deux porteurs`, () => {
    it(`  Quand un abandon est demandé
          Alors les deux porteurs ayant accès au projet devrait être notifié`, async () => {
      const notifierPorteurChangementStatutDemande = jest.fn();
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
        });

      const onAbandonDemandé = makeOnAbandonDemandé({
        notifierPorteurChangementStatutDemande,
        getModificationRequestInfoForStatusNotification,
      });

      await onAbandonDemandé(
        new AbandonDemandé({
          payload: {
            demandeAbandonId: 'la-demande',
            projetId: 'le-projet',
            porteurId: 'le-porteur',
            autorité: 'dgec',
          },
        }),
      );

      expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2);
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: 'porteur1@test.test',
          status: 'envoyée',
          fullName: 'Porteur de projet 1',
          porteurId: 'porteur-1',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        }),
      );

      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: 'porteur2@test.test',
          status: 'envoyée',
          fullName: 'Porteur de projet 2',
          porteurId: 'porteur-2',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: true,
        }),
      );
    });
  });
});
