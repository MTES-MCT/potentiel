import { NotificationService } from '../..';
import { logger } from '@core/utils';
import routes from '@routes';
import { GetDataForAbandonConfirméNotification } from '../../../modificationRequest/queries';
import { AbandonConfirmé } from '@modules/demandeModification';

export const makeOnAbandonConfirmé =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    getDataForAbandonConfirméNotification: GetDataForAbandonConfirméNotification;
    dgecEmail: string;
  }) =>
  async ({ payload: { demandeAbandonId } }: AbandonConfirmé) => {
    await deps.getDataForAbandonConfirméNotification(demandeAbandonId).match(
      async ({ chargeAffaire, nomProjet, appelOffreId, périodeId }) => {
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
