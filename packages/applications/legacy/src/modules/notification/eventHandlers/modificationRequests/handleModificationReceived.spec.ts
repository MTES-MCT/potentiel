import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import {
  GetProjectInfoForModificationReceivedNotification,
  ModificationReceived,
} from '../../../modificationRequest';
import routes from '../../../../routes';
import { User, ProjectAppelOffre } from '../../../../entities';
import { handleModificationReceived } from './handleModificationReceived';
import { NotificationService } from '../../NotificationService';
import { UserRepo } from '../../../../dataAccess';
import { GetProjectAppelOffre } from '../../../projectAppelOffre';
import { CahierDesChargesModifié } from '@potentiel-domain/appel-offre';

describe(`Notifier lorsqu'un porteur dépose une demande de modification`, () => {
  const modificationRequestId = 'id-demande';
  const projetId = 'id-projet';
  const getProjectAppelOffres: GetProjectAppelOffre = jest.fn(
    () =>
      ({
        changementPuissance: { ratios: { max: 1.1, min: 0.9 } },
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              paruLe: '30/08/2022',
              type: 'modifié',
              seuilSupplémentaireChangementPuissance: { ratios: { max: 1.4, min: 0.9 } },
            } as CahierDesChargesModifié,
          ] as ProjectAppelOffre['periode']['cahiersDesChargesModifiésDisponibles'],
        } as ProjectAppelOffre['periode'],
      }) as ProjectAppelOffre,
  );
  describe(`Cas général`, () => {
    it(`Etant donné un projet sous l'autorité DREAL
      Et ayant plusieurs porteurs rattachés
      Lorsque l'un des porteurs informe le préfet d'une modification du projet
      Lorsque l'un des porteurs informe le préfet d'une modification de l'actionnaire du projet
      Alors personne ne devrait être notifié`, async () => {
      const sendNotification = jest.fn<NotificationService['sendNotification']>();

      const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
        () =>
          okAsync({
            porteursProjet: [
              { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
              { email: 'porteur2@test.test', fullName: 'Porteur de Projet 2', id: 'id-user-2' },
            ],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'regionA / regionB',
            evaluationCarboneDeRéférence: 1,
            appelOffreId: 'CRE4 - Sol',
            periodeId: '1',
            familleId: '1',
            cahierDesChargesActuel: 'initial',
            puissanceInitiale: 100,
            technologie: 'pv',
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
        getProjectInfoForModificationReceivedNotification,
        findUsersForDreal,
        getProjectAppelOffres,
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

      expect(sendNotification).toHaveBeenCalledTimes(0);
    });
  });

  describe(`Lorsque la modification est de type "fournisseur"`, () => {
    it(`Lorsque la nouvelle evaluationCarbone est supérieure à la valeur de référence et inférieure à la tolérance
        Alors une section alerte ne devrait pas être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn<NotificationService['sendNotification']>();

      const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
        () =>
          okAsync({
            porteursProjet: [
              { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
            ],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'région-du-projet',
            evaluationCarboneDeRéférence: 100,
            cahierDesChargesActuel: 'iniital',
            puissanceInitiale: 100,
            appelOffreId: 'CRE4 - Sol',
            periodeId: '1',
            familleId: '1',
            technologie: 'pv',
          });

      await handleModificationReceived({
        sendNotification,
        getProjectInfoForModificationReceivedNotification,
        findUsersForDreal: jest.fn<UserRepo['findUsersForDreal']>(),
        getProjectAppelOffres,
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
      const sendNotification = jest.fn<NotificationService['sendNotification']>();

      const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
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
            evaluationCarboneDeRéférence: 100,
            cahierDesChargesActuel: '30/08/2022',
            puissanceInitiale: 100,
            appelOffreId: 'CRE4 - Sol',
            periodeId: '1',
            familleId: '1',
            technologie: 'pv',
          });

      await handleModificationReceived({
        sendNotification,
        getProjectInfoForModificationReceivedNotification,
        findUsersForDreal: jest.fn<UserRepo['findUsersForDreal']>(),
        getProjectAppelOffres,
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

      if (notification.type !== 'pp-modification-received') return;
      expect(notification.variables.demande_action_pp).toEqual(
        `Vous venez de signaler une augmentation de l'évaluation carbone de votre projet. Cette nouvelle valeur entraîne une dégradation de la note du projet. Celui-ci ne recevra pas d'attestation de conformité.`,
      );
    });
  });

  describe(`Changement de puissance en "information enregistrée" permis par le CDC 2022`, () => {
    it(`Étant donné un projet avec le cahier des charges du 30/08/2022
        Lorsqu'un changement de puissance est enregistré avec un seuil d'augmentation compris entre le seuil du CDC initial et le seuil du CDC 2022
        Alors la Dreal concernée devrait recevoir une notification spécifique à cette situation`, async () => {
      const sendNotification = jest.fn<NotificationService['sendNotification']>();

      const getProjectInfoForModificationReceivedNotification: GetProjectInfoForModificationReceivedNotification =
        () =>
          okAsync({
            porteursProjet: [],
            nomProjet: 'nom-du-projet',
            departementProjet: 'département-du-projet',
            regionProjet: 'regionA',
            evaluationCarboneDeRéférence: 1,
            cahierDesChargesActuel: '30/08/2022',
            puissanceInitiale: 100,
            appelOffreId: 'CRE4 - Sol',
            periodeId: '1',
            familleId: '1',
            technologie: 'pv',
          });

      const findUsersForDreal = (region: string) =>
        Promise.resolve([{ email: 'drealA@test.test', fullName: 'drealA' } as User]);

      await handleModificationReceived({
        sendNotification,
        getProjectInfoForModificationReceivedNotification,
        findUsersForDreal,
        getProjectAppelOffres,
      })(
        new ModificationReceived({
          payload: {
            type: 'puissance',
            modificationRequestId,
            projectId: projetId,
            requestedBy: 'id-user-1',
            justification: 'justification',
            authority: 'dreal',
            puissance: 135,
          },
        }),
      );

      expect(sendNotification).toHaveBeenCalledTimes(1);

      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dreal-modification-puissance-cdc-2022',
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
            departement_projet: 'département-du-projet',
          }),
        }),
      );
    });
  });
});
