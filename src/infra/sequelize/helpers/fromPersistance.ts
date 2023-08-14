import { DomainEvent } from '../../../core/domain';
import { logger } from '../../../core/utils';
import * as AuthorizationEvents from '../../../modules/authZ/events';
import * as CandidateNotificationEvents from '../../../modules/notificationCandidats/events';
import * as ModificationRequestEvents from '../../../modules/modificationRequest/events';
import * as ProjectEvents from '../../../modules/project/events';
import * as ProjectClaimEvents from '../../../modules/projectClaim/events';
import * as UserEvents from '../../../modules/users/events';
import * as LegacyCandidateNotificationEvents from '../../../modules/legacyCandidateNotification/events';
import * as DemandeRecoursModificationEvents from '../../../modules/demandeModification/demandeRecours/events';
import * as DemandeDelaiEvents from '../../../modules/demandeModification/demandeDélai/events';
import * as DemandeAbandonEvents from '../../../modules/demandeModification/demandeAbandon/events';
import * as DemandeAnnulationAbandonEvents from '../../../modules/demandeModification/demandeAnnulationAbandon/events';
import * as DemandeChangementDePuissanceEvents from '../../../modules/demandeModification/demandeChangementDePuissance/events';
import * as UtilisateurEvents from '../../../modules/utilisateur/events';

import { transformerISOStringEnDate } from '../../helpers';

interface EventProps {
  payload: any;
  requestId?: string;
  original?: {
    occurredAt: Date;
    version: number;
    eventId: string;
  };
}
interface HasEventConstructor {
  new (props: EventProps): DomainEvent;
}

const EventClassByType: Record<string, HasEventConstructor> = {
  ...ModificationRequestEvents,
  ...CandidateNotificationEvents,
  ...ProjectEvents,
  ...AuthorizationEvents,
  ...ProjectClaimEvents,
  ...UserEvents,
  ...LegacyCandidateNotificationEvents,
  ...DemandeRecoursModificationEvents,
  ...DemandeDelaiEvents,
  ...DemandeAbandonEvents,
  ...DemandeAnnulationAbandonEvents,
  ...DemandeChangementDePuissanceEvents,
  ...UtilisateurEvents,
};

export const fromPersistance = (eventRaw: any): DomainEvent | null => {
  const EventClass = EventClassByType[eventRaw.type];

  if (!EventClass) {
    logger.warning(
      `SequelizeEventStore does not recognize this event type (see sequelizeEventStore.fromPersistance for missing type ${eventRaw.type}`,
    );
    return null;
  }

  return new EventClass({
    payload: transformerISOStringEnDate(eventRaw.payload),
    requestId: eventRaw.requestId?.toString(),
    original: {
      version: eventRaw.version,
      occurredAt: new Date(eventRaw.occurredAt),
      eventId: eventRaw.id,
    },
  });
};
