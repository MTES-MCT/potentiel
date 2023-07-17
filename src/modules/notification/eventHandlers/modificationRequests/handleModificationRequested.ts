import { NotificationService } from '../..';
import { logger } from '@core/utils';
import { UserRepo } from '@dataAccess';
import routes from '@routes';
import {
  GetProjectInfoForModificationRequestedNotification,
  ModificationRequested,
} from '../../../modificationRequest';

export const handleModificationRequested =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    findUsersForDreal: UserRepo['findUsersForDreal'];
    getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification;
  }) =>
  async (event: ModificationRequested) => {
    const { modificationRequestId, projectId, type, authority } = event.payload;

    await deps.getProjectInfoForModificationRequestedNotification(projectId).match(
      async ({ nomProjet, porteursProjet, departementProjet, regionProjet }) => {
        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            deps.sendNotification({
              type: 'modification-request-status-update',
              message: {
                email,
                name: fullName,
                subject: `Votre demande de type "${type}" pour le projet ${nomProjet}`,
              },
              context: {
                modificationRequestId,
                userId: id,
              },
              variables: {
                nom_projet: nomProjet,
                type_demande: type,
                status: 'envoyée',
                modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
              },
            }),
          ),
        );

        if (authority === 'dreal') {
          const regions = regionProjet.split(' / ');
          await Promise.all(
            regions.map(async (region) => {
              const drealUsers = await deps.findUsersForDreal(region);

              await Promise.all(
                drealUsers.map((drealUser) =>
                  deps.sendNotification({
                    type: 'admin-modification-requested',
                    message: {
                      email: drealUser.email,
                      name: drealUser.fullName,
                      subject: `Potentiel - Nouvelle demande de type "${type}" dans votre département ${departementProjet}`,
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
        }
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
