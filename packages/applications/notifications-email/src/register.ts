import {
  type RegisterEnvoyerNotificationEmailCommandDependencies,
  registerEnvoyerNotificationEmailCommand,
} from './envoyerNotificationEmail.command.js';

export type RegisterNotificationsEmailDependencies =
  RegisterEnvoyerNotificationEmailCommandDependencies;

export const registerNotificationsEmailCommands = (
  deps: RegisterNotificationsEmailDependencies,
) => {
  registerEnvoyerNotificationEmailCommand(deps);
};
