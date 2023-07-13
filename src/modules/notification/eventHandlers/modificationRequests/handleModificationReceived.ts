import { NotificationService } from '../..';
import { logger } from '@core/utils';
import { UserRepo } from '@dataAccess';
import routes from '@routes';
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationReceived,
} from '../../../modificationRequest';

export const handleModificationReceived =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    findUsersForDreal: UserRepo['findUsersForDreal'];
    getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
  }) =>
  async (event: ModificationReceived) => {
    const { modificationRequestId, projectId, type, requestedBy } = event.payload;
    await deps.getModificationRequestInfoForStatusNotification(modificationRequestId).match(
      async ({
        departementProjet,
        regionProjet,
        nomProjet,
        porteursProjet,
        evaluationCarboneDeRéférence,
      }) => {
        await Promise.all(
          porteursProjet.map(async ({ fullName, email, id }) => {
            const notificationPayload = {
              type: 'pp-modification-received' as 'pp-modification-received',
              message: {
                email: email,
                name: fullName,
                subject: `Potentiel - Nouvelle information de type ${type} enregistrée pour votre projet ${nomProjet}`,
              },
              context: {
                modificationRequestId,
                projectId,
                userId: id,
              },
              variables: {
                nom_projet: nomProjet,
                type_demande: type,
                button_url: routes.USER_LIST_REQUESTS,
                button_title: 'Consulter la demande',
                button_instructions: `Pour la consulter, connectez-vous à Potentiel.`,
                demande_action_pp: undefined as string | undefined,
              },
            };

            if (type === 'producteur') {
              notificationPayload.variables.button_url = routes.LISTE_PROJETS;
              notificationPayload.variables.button_title = 'Voir mes projets';
              notificationPayload.variables.button_instructions = `Pour consulter vos projets, connectez-vous à Potentiel.`;
            }

            if (type === 'fournisseur' && event.payload.evaluationCarbone) {
              const newEvaluationCarbone = Number(event.payload.evaluationCarbone);
              const switchBracket =
                Math.round(newEvaluationCarbone / 50) !==
                Math.round(evaluationCarboneDeRéférence / 50);

              const evaluationCarboneIsOutOfBounds =
                newEvaluationCarbone > evaluationCarboneDeRéférence && switchBracket;

              if (evaluationCarboneIsOutOfBounds) {
                notificationPayload.variables.demande_action_pp = `Vous venez de signaler une augmentation de l'évaluation carbone de votre projet. Cette nouvelle valeur entraîne une dégradation de la note du projet. Celui-ci ne recevra pas d'attestation de conformité.`;
              }
            }
            deps.sendNotification(notificationPayload);
          }),
        );

        const regions = regionProjet.split(' / ');

        await Promise.all(
          regions.map(async (region) => {
            const drealUsers = await deps.findUsersForDreal(region);

            if (!drealUsers) {
              return;
            }
            await Promise.all(
              drealUsers.map((drealUser) =>
                deps.sendNotification({
                  type: 'dreal-modification-received',
                  message: {
                    email: drealUser.email,
                    name: drealUser.fullName,
                    subject: `Potentiel - Nouvelle information de type ${type} enregistrée dans votre département ${departementProjet}`,
                  },
                  context: {
                    modificationRequestId,
                    projectId,
                    dreal: region,
                    userId: drealUser.id,
                  },
                  variables: {
                    nom_projet: nomProjet,
                    departement_projet: departementProjet,
                    type_demande: type,
                    modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                  },
                }),
              ),
            );
          }),
        );
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
