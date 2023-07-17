import { logger } from '@core/utils';
import { UserRepo } from '@dataAccess';
import { DélaiDemandé } from '@modules/demandeModification';
import routes from '@routes';
import { NotificationService } from '../..';
import { GetProjectInfoForModificationRequestedNotification } from '@modules/modificationRequest/queries';

type OnDélaiDemandé = (evenement: DélaiDemandé) => Promise<void>;

type MakeOnDélaiDemandé = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  findUsersForDreal: UserRepo['findUsersForDreal'];
  getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification;
  dgecEmail: string;
}) => OnDélaiDemandé;

export const makeOnDélaiDemandé: MakeOnDélaiDemandé =
  ({
    sendNotification,
    getProjectInfoForModificationRequestedNotification,
    findUsersForDreal,
    dgecEmail,
  }) =>
  async ({ payload: { demandeDélaiId, autorité, projetId } }) => {
    await getProjectInfoForModificationRequestedNotification(projetId).match(
      async ({
        nomProjet,
        porteursProjet,
        departementProjet,
        regionProjet,
        appelOffreId,
        périodeId,
      }) => {
        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            sendNotification({
              type: 'modification-request-status-update',
              message: {
                email,
                name: fullName,
                subject: `Votre demande de délai pour le projet ${nomProjet}`,
              },
              context: {
                modificationRequestId: demandeDélaiId,
                userId: id,
              },
              variables: {
                nom_projet: nomProjet,
                type_demande: 'délai',
                status: 'envoyée',
                modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
              },
            }),
          ),
        );

        if (autorité === 'dreal') {
          const regions = regionProjet.split(' / ');
          await Promise.all(
            regions.map(async (region) => {
              const drealUsers = await findUsersForDreal(region);

              await Promise.all(
                drealUsers.map((drealUser) =>
                  sendNotification({
                    type: 'admin-modification-requested',
                    message: {
                      email: drealUser.email,
                      name: drealUser.fullName,
                      subject: `Potentiel - Nouvelle demande de type délai dans votre département ${departementProjet}`,
                    },
                    context: {
                      modificationRequestId: demandeDélaiId,
                      projectId: projetId,
                      dreal: region,
                      userId: drealUser.id,
                    },
                    variables: {
                      nom_projet: nomProjet,
                      departement_projet: departementProjet,
                      type_demande: 'délai',
                      modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                    },
                  }),
                ),
              );
            }),
          );
        } else {
          await sendNotification({
            type: 'admin-modification-requested',
            message: {
              email: dgecEmail,
              name: 'DGEC',
              subject: `Potentiel - Nouvelle demande de type délai pour un projet ${appelOffreId} période ${périodeId}`,
            },
            context: {
              modificationRequestId: demandeDélaiId,
              projectId: projetId,
              dreal: '',
              userId: '',
            },
            variables: {
              nom_projet: nomProjet,
              departement_projet: departementProjet,
              type_demande: 'délai',
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
            },
          });
        }
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
