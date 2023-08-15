import { NotificationService } from '../..';
import { logger, wrapInfra } from '../../../../core/utils';
import { UserRepo } from '../../../../dataAccess';
import routes from '../../../../routes';
import {
  GetModificationRequestInfoForStatusNotification,
  ModificationRequestCancelled,
} from '../../../modificationRequest';

export const handleModificationRequestCancelled =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    findUsersForDreal: UserRepo['findUsersForDreal'];
    getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
    dgecEmail: string;
  }) =>
  async ({ payload: { modificationRequestId } }: ModificationRequestCancelled) => {
    const {
      sendNotification,
      findUsersForDreal,
      getModificationRequestInfoForStatusNotification,
      dgecEmail,
    } = deps;
    return getModificationRequestInfoForStatusNotification(modificationRequestId).match(
      ({ nomProjet, departementProjet, regionProjet, type, autorité, appelOffreId, périodeId }) => {
        if (autorité === 'dreal') {
          const regions = regionProjet.split(' / ');
          return wrapInfra(
            Promise.all(
              regions.map(async (region) => {
                // Notifiy existing dreal users
                const drealUsers = await findUsersForDreal(region);
                await Promise.all(
                  drealUsers.map(({ email, fullName: name }) =>
                    sendNotification({
                      type: 'modification-request-cancelled',
                      message: {
                        email,
                        name,
                        subject: `Annulation d'une demande de type ${type} dans le département ${departementProjet}`,
                      },
                      context: {
                        modificationRequestId,
                      },
                      variables: {
                        nom_projet: nomProjet,
                        type_demande: type,
                        departement_projet: departementProjet,
                        modification_request_url:
                          routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
                      },
                    }),
                  ),
                );
              }),
            ),
          );
        } else {
          return sendNotification({
            type: 'modification-request-cancelled',
            message: {
              email: dgecEmail,
              name: 'DGEC',
              subject: `Annulation d'une demande de type ${type} pour un projet ${appelOffreId} ${périodeId}`,
            },
            context: {
              modificationRequestId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: type,
              departement_projet: departementProjet,
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            },
          });
        }
      },
      (e: Error) => logger.error(e),
    );
  };
