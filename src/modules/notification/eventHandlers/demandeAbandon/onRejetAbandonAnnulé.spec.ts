import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import { RejetAbandonAnnulé } from '../../../demandeModification';
import { makeOnRejetAbandonAnnulé } from './onRejetAbandonAnnulé';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest';
import { NotifierPorteurChangementStatutDemande } from '../../useCases';

describe(`Notifier lors de l'annulation du rejet d'une demande d'abandon`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`Quand un rejet de demande d'abandon est annulé
        alors tous les porteurs ayant accès au projet devrait être notifiés`, async () => {
      const notifierPorteurChangementStatutDemande =
        jest.fn<NotifierPorteurChangementStatutDemande>();
      const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
        () =>
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
            autorité: 'dgec',
            appelOffreId: 'Sol',
            périodeId: '1',
          });

      const onRejetDemandeAbandonAnnulé = makeOnRejetAbandonAnnulé({
        notifierPorteurChangementStatutDemande,
        getModificationRequestInfoForStatusNotification,
      });

      await onRejetDemandeAbandonAnnulé(
        new RejetAbandonAnnulé({
          payload: {
            demandeAbandonId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'dgec',
          },
        }),
      );

      expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2);
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          email: 'porteur1@test.test',
          status: 'repassée en statut "envoyée"',
          fullName: 'Porteur de projet 1',
          porteurId: 'porteur-1',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: false,
        }),
      );
      expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          email: 'porteur2@test.test',
          status: 'repassée en statut "envoyée"',
          fullName: 'Porteur de projet 2',
          porteurId: 'porteur-2',
          typeDemande: 'abandon',
          nomProjet: 'nom-du-projet',
          modificationRequestId: 'la-demande',
          hasDocument: false,
        }),
      );
    });
  });
});
