import {
  registerEnvoyerNotificationCommand,
  RegisterEnvoyerNotificationCommandDependencies,
} from './envoyerNotification.command.js';

export type RegisterNotificationDependencies = RegisterEnvoyerNotificationCommandDependencies;

export const registerNotificationsCommands = (deps: RegisterNotificationDependencies) => {
  registerEnvoyerNotificationCommand(deps);
};
