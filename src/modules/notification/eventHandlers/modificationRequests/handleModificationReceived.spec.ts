import { okAsync } from '@core/utils';
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationReceived,
} from '@modules/modificationRequest';
import routes from '@routes';
import { User } from '@entities';
import { handleModificationReceived } from './handleModificationReceived';

describe(`Notifier lorsqu'un porteur dépose une demande de modification`, () => {
  const modificationRequestId = 'id-demande';
  const projetId = 'id-projet';
  describe(`Cas général`, () => {
    it(`Etant donné un projet sous l'autorité DREAL
      Et ayant plusieurs porteurs rattachés
      Lorsque l'un des porteurs informe le préfet d'une modification du projet
      Alors tous les porteurs ayant accès au projet devraient être notifiés
      Et tous les agents des DREALs rattachées au projet devraient être notifiés`, async () => {
      const sendNotification = jest.fn();

      const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
        () =>
          okAsync({
            porteursProjet: [
              { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
              { email: 'porteur2@test.test', fullName: 'Porteur de Projet 2', id: 'id-user-2' },
            ],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'regionA / regionB',
            type: 'puissance',
            evaluationCarboneDeRéférence: 1,
          });

      const findUsersForDreal = (region: string) =>
        Promise.resolve(
          region === 'regionA'
            ? [{ email: 'drealA@test.test', fullName: 'drealA' } as User]
            : [
                { email: 'drealB@test.test', fullName: 'drealB' } as User,
                { email: 'drealC@test.test', fullName: 'drealC' } as User,
              ],
        );

      await handleModificationReceived({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        findUsersForDreal,
      })(
        new ModificationReceived({
          payload: {
            type: 'actionnaire',
            modificationRequestId,
            projectId: projetId,
            requestedBy: 'id-user-1',
            actionnaire: 'test actionnaire',
            justification: 'justification',
            authority: 'dreal',
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(5);

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pp-modification-received',
          message: expect.objectContaining({
            email: 'porteur1@test.test',
          }),
          context: expect.objectContaining({
            modificationRequestId,
            userId: 'id-user-1',
            projectId: projetId,
          }),
          variables: expect.objectContaining({
            type_demande: 'actionnaire',
            button_url: routes.USER_LIST_REQUESTS,
            button_title: 'Consulter la demande',
            button_instructions: `Pour la consulter, connectez-vous à Potentiel.`,
            demande_action_pp: undefined,
          }),
        }),
      );

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pp-modification-received',
          message: expect.objectContaining({
            email: 'porteur2@test.test',
          }),
          context: expect.objectContaining({
            modificationRequestId,
            userId: 'id-user-2',
            projectId: projetId,
          }),
          variables: expect.objectContaining({
            type_demande: 'actionnaire',
            button_url: routes.USER_LIST_REQUESTS,
            button_title: 'Consulter la demande',
            button_instructions: `Pour la consulter, connectez-vous à Potentiel.`,
            demande_action_pp: undefined,
          }),
        }),
      );

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dreal-modification-received',
          message: expect.objectContaining({
            email: 'drealA@test.test',
            name: 'drealA',
          }),
          context: expect.objectContaining({
            modificationRequestId,
            dreal: 'regionA',
            projectId: projetId,
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            type_demande: 'actionnaire',
            departement_projet: 'département-du-projet',
          }),
        }),
      );

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dreal-modification-received',
          message: expect.objectContaining({
            email: 'drealB@test.test',
            name: 'drealB',
          }),
          context: expect.objectContaining({
            modificationRequestId,
            dreal: 'regionB',
            projectId: projetId,
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            type_demande: 'actionnaire',
            departement_projet: 'département-du-projet',
          }),
        }),
      );

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dreal-modification-received',
          message: expect.objectContaining({
            email: 'drealC@test.test',
            name: 'drealC',
          }),
          context: expect.objectContaining({
            modificationRequestId,
            dreal: 'regionB',
            projectId: projetId,
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            type_demande: 'actionnaire',
            departement_projet: 'département-du-projet',
          }),
        }),
      );
    });
  });

  describe(`Lorsque la modification est de type "fournisseur"`, () => {
    it(`Lorsque la nouvelle evaluationCarbone est supérieure à la valeur de référence et inférieure à la tolérance
        Alors une section alerte ne devrait pas être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn();

      const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
        () =>
          okAsync({
            porteursProjet: [
              { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
            ],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'région-du-projet',
            type: 'fournisseur',
            evaluationCarboneDeRéférence: 100,
          });

      await handleModificationReceived({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        findUsersForDreal: jest.fn(),
      })(
        new ModificationReceived({
          payload: {
            type: 'fournisseur',
            modificationRequestId,
            projectId: projetId,
            requestedBy: 'id-user-1',
            justification: 'justification',
            fournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'nom fournisseur' }],
            evaluationCarbone: 124,
            authority: 'dreal',
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(1);

      const [notification] = sendNotification.mock.calls.map((call) => call[0]);

      if (notification.type !== 'pp-modification-received') return;
      expect(notification.variables.demande_action_pp).toBeUndefined();
    });

    it(`Lorsque la nouvelle evaluationCarbone est supérieure à la valeur de référence et inférieur à la tolérance
        Alors une section alerte devrait être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn();

      const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
        () =>
          okAsync({
            porteursProjet: [
              {
                email: 'porteur1@test.test',
                fullName: 'Porteur de Projet 1',
                id: 'id-user-1',
              },
            ],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'région-du-projet',
            type: 'fournisseur',
            evaluationCarboneDeRéférence: 100,
          });

      await handleModificationReceived({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        findUsersForDreal: jest.fn(),
      })(
        new ModificationReceived({
          payload: {
            type: 'fournisseur',
            modificationRequestId,
            projectId: projetId,
            requestedBy: 'id-user-1',
            justification: 'justification',
            fournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'nom fournisseur' }],
            evaluationCarbone: 125,
            authority: 'dreal',
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(1);

      const [notification] = sendNotification.mock.calls.map((call) => call[0]);

      console.log('notification', notification);

      if (notification.type !== 'pp-modification-received') return;
      expect(notification.variables.demande_action_pp).toEqual(
        `Vous venez de signaler une augmentation de l'évaluation carbone de votre projet. Cette nouvelle valeur entraîne une dégradation de la note du projet. Celui-ci ne recevra pas d'attestation de conformité.`,
      );
    });
  });
});
