import type { NotificationApplication } from '@potentiel-domain/notifications-application';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const notificationApplicationAjoutéeProjector = async ({
  payload: { identifiantUtilisateur, identifiantProjet, domaine, dateChangement },
}: NotificationApplication.NotificationApplicationAjoutéeEvent) => {
  await upsertProjection<NotificationApplication.NotificationApplicationEntity>(
    `notification-application|${identifiantUtilisateur}#${identifiantProjet}#${domaine}#${dateChangement}`,
    {
      identifiantUtilisateur,
      identifiantProjet,
      domaine,
      dateChangement,
    },
  );
};
