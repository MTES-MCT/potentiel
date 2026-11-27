import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type { NotificationApplicationAjoutéeEvent } from '../notificationApplication.event.js';

export type AjouterNotificationApplicationOptions = {
  domaine: NotificationApplicationAjoutéeEvent['payload']['domaine'];
  identifiantProjet: IdentifiantProjet.ValueType;
  dateChangement: DateTime.ValueType;
};
