import { NotificationApplication } from '@potentiel-domain/notifications-application';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

export const setupNotificationsApplication = () => {
  NotificationApplication.registerNotificationApplicationCommands({ loadAggregate });
};
