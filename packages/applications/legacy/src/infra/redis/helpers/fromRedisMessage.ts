import { DomainEvent } from '../../../core/domain';
import * as AuthorizationEvents from '../../../modules/authZ/events';
import * as CandidateNotificationEvents from '../../../modules/notificationCandidats/events';
import * as ProjectEvents from '../../../modules/project/events';
import * as UserEvents from '../../../modules/users/events';
import * as UtilisateurEvents from '../../../modules/utilisateur/events';
import { RedisMessage } from './RedisMessage';

import { transformerISOStringEnDate } from '../../helpers';

import { logger } from '../../../core/utils';

interface EventProps {
  payload: any;
  requestId?: string;
  original?: {
    occurredAt: Date;
    version: number;
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

export const fromRedisMessage = (message: RedisMessage): DomainEvent | null => {
  const EventClass = EventClassByType[message.type];

  if (!EventClass) {
    logger.warning(`Event class not recognized`, { event: message });
    return null;
  }

  const original = {
    version: 1,
    occurredAt: new Date(Number(message.occurredAt)),
  };

  if (original && isNaN(original.occurredAt.getTime())) {
    throw new Error('message occurredAt is not a valid timestamp');
  }

  return new EventClass({
    payload: {
      ...transformerISOStringEnDate(message.payload),
    },
    original: {
      version: 1,
      occurredAt: new Date(Number(message.occurredAt)),
    },
  });
};
