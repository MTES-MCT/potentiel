import { NotificationService } from '../..';
import { logger } from '@core/utils';
import routes from '@routes';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '../../../modificationRequest';
import { AbandonAnnulé } from '@modules/demandeModification';

export const makeOnAbandonAnnulé =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    getDataForStatutDemandeAbandonModifiéNotification: GetDataForStatutDemandeAbandonModifiéNotification;
    dgecEmail: string;
  }) =>
  async ({ payload: { demandeAbandonId } }: AbandonAnnulé) => {
    const { sendNotification, getDataForStatutDemandeAbandonModifiéNotification, dgecEmail } = deps;
    return getDataForStatutDemandeAbandonModifiéNotification(demandeAbandonId).match(
      async ({ nomProjet, chargeAffaire, appelOffreId, périodeId, départementProjet }) => {
        await sendNotification({
          type: 'modification-request-cancelled',
          message: {
            email: dgecEmail,
            name: 'DGEC',
            subject: `Demande d'abandon annulée pour le projet ${nomProjet.toLowerCase()} (${appelOffreId} ${périodeId})`,
          },
          context: {
            modificationRequestId: demandeAbandonId,
          },
          variables: {
            nom_projet: nomProjet,
            type_demande: 'abandon',
            departement_projet: départementProjet,
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
          },
        });

        if (chargeAffaire) {
          await sendNotification({
            type: 'modification-request-cancelled',
            message: {
              email: chargeAffaire.email,
              name: chargeAffaire.fullName,
              subject: `Demande d'abandon annulée pour le projet ${nomProjet.toLowerCase()} (${appelOffreId} ${périodeId})`,
            },
            context: {
              modificationRequestId: demandeAbandonId,
            },
            variables: {
              nom_projet: nomProjet,
              type_demande: 'abandon',
              departement_projet: départementProjet,
              modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
            },
          });
        }
      },
      (error: Error) => {
        logger.error(error);
      },
    );
  };
