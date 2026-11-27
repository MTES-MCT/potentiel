import { NotificationApplication } from '@potentiel-domain/notifications-application';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupNotificationsApplication = () => {
  NotificationApplication.registerNotificationApplicationCommands({ loadAggregate });
  NotificationApplication.registerNotificationApplicationQueries({ list: listProjection });
};
