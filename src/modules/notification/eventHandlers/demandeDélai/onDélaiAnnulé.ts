import { logger } from '../../../../core/utils';
import { UserRepo } from '../../../../dataAccess';
import { DélaiAnnulé } from "../../../demandeModification";
import routes from '../../../../routes';
import { NotificationService } from '../..';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest';

type OnDélaiAnnulé = (evenement: DélaiAnnulé) => Promise<void>;

type MakeOnDélaiAnnulé = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
  dgecEmail: string;
  findUsersForDreal: UserRepo['findUsersForDreal'];
}) => OnDélaiAnnulé;

export const makeOnDélaiAnnulé: MakeOnDélaiAnnulé =
  ({
    sendNotification,
    getModificationRequestInfoForStatusNotification,
    dgecEmail,
    findUsersForDreal,
  }) =>
  async ({ payload: { demandeDélaiId } }: DélaiAnnulé) => {
    return getModificationRequestInfoForStatusNotification(demandeDélaiId).match(
      async ({
        porteursProjet,
        nomProjet,
        autorité,
        regionProjet,
        departementProjet,
        appelOffreId,
        périodeId,
      }) => {
        if (porteursProjet.length) {
          await Promise.all(
            porteursProjet.map(({ email, fullName, id }) => {
              return sendNotification({
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
                  status: 'annulée',
                  modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                  document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
                },
              });
            }),
          );
        }

        if (autorité === 'dreal') {
          const regions = regionProjet.split(' / ');
          Promise.all(
            regions.map(async (region) => {
              const drealUsers = await findUsersForDreal(region);
              await Promise.all(
                drealUsers.map(({ email, fullName: name }) => {
                  return sendNotification({
                    type: 'modification-request-cancelled',
                    message: {
                      email,
                      name,
                      subject: `Annulation d'une demande de délai dans le département ${departementProjet}`,
                    },
                    context: {
                      modificationRequestId: demandeDélaiId,
                    },
                    variables: {
                      nom_projet: nomProjet,
                      type_demande: 'délai',
                      departement_projet: departementProjet,
                      modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                    },
                  });
                }),
              );
            }),
          );
        } else {
          await sendNotification({
            type: 'modification-request-cancelled',
            message: {
              email: dgecEmail,
              name: 'DGEC',
              subject: `Annulation d'une demande de délai (${appelOffreId} ${périodeId})`,
            },
            context: {
              modificationRequestId: demandeDélaiId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: 'délai',
              departement_projet: departementProjet,
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
