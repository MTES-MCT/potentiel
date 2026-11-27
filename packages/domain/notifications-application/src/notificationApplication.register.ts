import type { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterNotificationApplicationCommand } from './ajouter/ajouterNotificationApplication.command.js';

type NotificationApplicationCommandsDependencies = { loadAggregate: LoadAggregate };

export const registerNotificationApplicationCommands = ({
  loadAggregate,
}: NotificationApplicationCommandsDependencies) => {
  registerAjouterNotificationApplicationCommand(loadAggregate);
};
