import { NotificationService } from '../..';
import { logger } from '../../../../core/utils';
import routes from '../../../../routes';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '../../../modificationRequest/queries';
import { AbandonConfirmé } from "../../../demandeModification";

export const makeOnAbandonConfirmé =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    getDataForStatutDemandeAbandonModifiéNotification: GetDataForStatutDemandeAbandonModifiéNotification;
    dgecEmail: string;
  }) =>
  async ({ payload: { demandeAbandonId } }: AbandonConfirmé) => {
    await deps.getDataForStatutDemandeAbandonModifiéNotification(demandeAbandonId).match(
      async ({ chargeAffaire, nomProjet, appelOffreId, périodeId, porteursProjet }) => {
        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            deps.sendNotification({
              type: 'modification-request-status-update',
              message: {
                email,
                name: fullName,
                subject: `Votre demande de type abandon pour le projet ${nomProjet}`,
              },
              context: {
                modificationRequestId: demandeAbandonId,
                userId: id,
              },
              variables: {
                nom_projet: nomProjet,
                type_demande: 'abandon',
                status: 'confirmé',
                modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
                document_absent: '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
              },
            }),
          ),
        );

        if (chargeAffaire) {
          const { email, fullName, id } = chargeAffaire;
          await deps.sendNotification({
            type: 'modification-request-confirmed',
            message: {
              email,
              name: fullName,
              subject: `Demande d'abandon confirmée pour le projet ${nomProjet.toLowerCase()} (${appelOffreId} ${périodeId})`,
            },
            context: {
              modificationRequestId: demandeAbandonId,
              userId: id,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: 'abandon',
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
            },
          });
        }

        await deps.sendNotification({
          type: 'modification-request-confirmed',
          message: {
            email: deps.dgecEmail,
            name: 'DGEC',
            subject: `Demande d'abandon confirmée pour le projet ${nomProjet.toLowerCase()} (${appelOffreId} ${périodeId})`,
          },
          context: {
            modificationRequestId: demandeAbandonId,
            userId: '',
          },
          variables: {
            nom_projet: nomProjet,
            type_demande: 'abandon',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
          },
        });
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
