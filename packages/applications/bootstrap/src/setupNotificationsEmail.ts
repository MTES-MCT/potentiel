import {
  registerNotificationsEmailCommands,
  type SendEmailPort,
} from '@potentiel-applications/notifications-email';

export type SetupNotificationsEmailDependencies = {
  sendEmail: SendEmailPort;
};
export const setupNotificationsEmail = (dependencies: SetupNotificationsEmailDependencies) => {
  registerNotificationsEmailCommands(dependencies);
};
