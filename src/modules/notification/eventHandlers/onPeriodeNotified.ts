import { PeriodeNotified } from "../../project";
import { GetRecipientsForPeriodeNotifiedNotification, NotificationService } from '..';

export const makeOnPeriodeNotified =
  ({
    sendNotification,
    getRecipientsForPeriodeNotifiedNotification,
  }: {
    sendNotification: NotificationService['sendNotification'];
    getRecipientsForPeriodeNotifiedNotification: GetRecipientsForPeriodeNotifiedNotification;
  }) =>
  async ({ payload: { appelOffreId, periodeId, notifiedOn } }: PeriodeNotified) => {
    const users = await getRecipientsForPeriodeNotifiedNotification();

    if (!users || !users.length) {
      return;
    }

    await Promise.all(
      users.map(({ id: userId, email, fullName: name }) =>
        sendNotification({
          type: 'tous-rôles-sauf-dgec-et-porteurs-nouvelle-periode-notifiée',
          message: {
            email,
            name,
            subject: `Potentiel - Notification de la période ${periodeId} de l'appel d'offres ${appelOffreId}`,
          },
          context: { userId },
          variables: {
            appel_offre: appelOffreId,
            periode: periodeId,
            date_notification: new Date(notifiedOn).toLocaleDateString(),
          },
        }),
      ),
    );
  };
