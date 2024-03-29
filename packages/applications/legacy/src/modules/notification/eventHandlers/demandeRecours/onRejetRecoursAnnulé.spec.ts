import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import { RejetRecoursAnnulé } from '../../../demandeModification';
import { makeOnRejetRecoursAnnulé } from './onRejetRecoursAnnulé';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest';
import { NotificationService } from '../..';

describe(`Notifier lors de l'annulation du rejet d'une demande de recours`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`  Quand un rejet de demande de recours est annulé,
          alors tous les porteurs ayant accès au projet devrait être notifiés`, async () => {
      const sendNotification = jest.fn<NotificationService['sendNotification']>();
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
            type: 'recours',
            autorité: 'dgec',
            appelOffreId: 'Sol',
            périodeId: '1',
          });

      const onRejetDemandeDélaiAnnulé = makeOnRejetRecoursAnnulé({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
      });

      await onRejetDemandeDélaiAnnulé(
        new RejetRecoursAnnulé({
          payload: {
            demandeRecoursId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'la-dreal',
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(2);
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
        }),
      );
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
        }),
      );
    });
  });
});
