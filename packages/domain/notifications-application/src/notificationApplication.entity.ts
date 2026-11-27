import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type { NotificationApplicationAjoutéeEvent } from './notificationApplication.event.js';

export type NotificationApplicationEntity = Entity<
  'notification-application',
  {
    identifiantUtilisateur: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    domaine: NotificationApplicationAjoutéeEvent['payload']['domaine'];
    dateChangement: DateTime.RawType;
  }
>;
