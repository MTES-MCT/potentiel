import { DomainEvent } from '@core/domain';
import * as AuthorizationEvents from '@modules/authZ/events';
import * as CandidateNotificationEvents from '@modules/notificationCandidats/events';
import * as ModificationRequestEvents from '@modules/modificationRequest/events';
import * as ProjectEvents from '@modules/project/events';
import * as ProjectClaimEvents from '@modules/projectClaim/events';
import * as UserEvents from '@modules/users/events';
import * as FileEvents from '@modules/file/events';
import * as EDFEvents from '@modules/edf/events';
import * as EnedisEvents from '@modules/enedis/events';
import * as LegacyCandidateNotificationEvents from '@modules/legacyCandidateNotification/events';
import * as DemandeRecoursModificationEvents from '@modules/demandeModification/demandeRecours/events';
import * as DemandeDélaiEvents from '@modules/demandeModification/demandeDélai/events';
import * as DemandeAbandonEvents from '@modules/demandeModification/demandeAbandon/events';
import * as DemandeAnnulationAbandonEvents from '@modules/demandeModification/demandeAnnulationAbandon/events';
import * as DemandeChangementDePuissanceEvents from '@modules/demandeModification/demandeChangementDePuissance/events';
import * as ImportDonnéesRaccordementEvents from '@modules/imports/donnéesRaccordement/events';
import * as UtilisateurEvents from '@modules/utilisateur/events';
import { RedisMessage } from './RedisMessage';

import { transformerISOStringEnDate } from '../../helpers';
import { logger } from '@core/utils';

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
  ...ModificationRequestEvents,
  ...CandidateNotificationEvents,
  ...ProjectEvents,
  ...AuthorizationEvents,
  ...ProjectClaimEvents,
  ...UserEvents,
  ...LegacyCandidateNotificationEvents,
  ...FileEvents,
  ...EDFEvents,
  ...EnedisEvents,
  ...DemandeRecoursModificationEvents,
  ...DemandeDélaiEvents,
  ...DemandeAbandonEvents,
  ...DemandeAnnulationAbandonEvents,
  ...DemandeChangementDePuissanceEvents,
  ...ImportDonnéesRaccordementEvents,
  ...UtilisateurEvents,
};

export const fromRedisMessage = (message: RedisMessage): DomainEvent | undefined => {
  const EventClass = EventClassByType[message.type];

  if (!EventClass) {
    logger.error(new Error('Event class not recognized'));
    return;
  }

  const original = {
    version: 1,
    occurredAt: new Date(Number(message.occurredAt)),
  };

  if (original && isNaN(original.occurredAt.getTime())) {
    throw new Error('message occurredAt is not a valid timestamp');
  }

  const payload = {
    ...transformerISOStringEnDate(message.payload),
  };

  return new EventClass({
    payload,
    original,
  });
};
