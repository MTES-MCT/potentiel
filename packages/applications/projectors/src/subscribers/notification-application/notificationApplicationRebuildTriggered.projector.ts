import { Where } from '@potentiel-domain/entity';
import type { NotificationApplication } from '@potentiel-domain/notifications-application';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

export const notificationApplicationRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjectionWhere<NotificationApplication.NotificationApplicationEntity>(
    'notification-application',
    {
      identifiantUtilisateur: Where.equal(id),
    },
  );
};
