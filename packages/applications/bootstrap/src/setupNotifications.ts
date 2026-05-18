import {
  registerNotificationsCommands,
  type SendEmailPort,
} from '@potentiel-applications/notifications';

export type SetupNotificationsDependencies = {
  sendEmail: SendEmailPort;
};
export const setupNotifications = (dependencies: SetupNotificationsDependencies) => {
  registerNotificationsCommands(dependencies);
};
