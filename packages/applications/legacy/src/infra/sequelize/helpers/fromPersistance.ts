import { DomainEvent } from '../../../core/domain';
import { logger } from '../../../core/utils';
import * as AuthorizationEvents from '../../../modules/authZ/events';
import * as CandidateNotificationEvents from '../../../modules/notificationCandidats/events';
import * as ProjectEvents from '../../../modules/project/events';
import * as UserEvents from '../../../modules/users/events';
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
  ...CandidateNotificationEvents,
  ...ProjectEvents,
  ...AuthorizationEvents,
  ...UserEvents,
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
