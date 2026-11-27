import type { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterNotificationApplicationCommand } from './ajouter/ajouterNotificationApplication.command.js';
import {
  type ListerNotificationsApplicationDependencies,
  registerListerNotificationsApplicationQuery,
} from './lister/listerNotificationsApplication.query.js';

type NotificationApplicationCommandsDependencies = { loadAggregate: LoadAggregate };

type NotificationApplicationQueriesDependencies = ListerNotificationsApplicationDependencies;

export const registerNotificationApplicationCommands = ({
  loadAggregate,
}: NotificationApplicationCommandsDependencies) => {
  registerAjouterNotificationApplicationCommand(loadAggregate);
};

export const registerNotificationApplicationQueries = (
  dependencies: NotificationApplicationQueriesDependencies,
) => {
  registerListerNotificationsApplicationQuery(dependencies);
};
