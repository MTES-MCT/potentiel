import { DomainEvent } from '@core/domain';
import * as AuthorizationEvents from '@modules/authZ/events';
import * as CandidateNotificationEvents from '@modules/notificationCandidats/events';
import * as ModificationRequestEvents from '@modules/modificationRequest/events';
import * as ProjectEvents from '@modules/project/events';
import * as ProjectClaimEvents from '@modules/projectClaim/events';
import * as UserEvents from '@modules/users/events';
import * as FileEvents from '@modules/file/events';
import * as LegacyCandidateNotificationEvents from '@modules/legacyCandidateNotification/events';
import * as DemandeRecoursModificationEvents from '@modules/demandeModification/demandeRecours/events';
import * as DemandeDélaiEvents from '@modules/demandeModification/demandeDélai/events';
import * as DemandeAbandonEvents from '@modules/demandeModification/demandeAbandon/events';
import * as DemandeAnnulationAbandonEvents from '@modules/demandeModification/demandeAnnulationAbandon/events';
import * as DemandeChangementDePuissanceEvents from '@modules/demandeModification/demandeChangementDePuissance/events';
import * as UtilisateurEvents from '@modules/utilisateur/events';
import { isLegacyEvent, RedisMessage } from './RedisMessage';

import { transformerISOStringEnDate } from '../../helpers';
import { DateMiseEnServiceTransmise } from '@modules/project/events';
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

const compatibilityEvents = { DateMiseEnServiceTransmise };

const EventClassByType: Record<string, HasEventConstructor> = {
  ...ModificationRequestEvents,
  ...CandidateNotificationEvents,
  ...ProjectEvents,
  ...AuthorizationEvents,
  ...ProjectClaimEvents,
  ...UserEvents,
  ...LegacyCandidateNotificationEvents,
  ...FileEvents,
  ...DemandeRecoursModificationEvents,
  ...DemandeDélaiEvents,
  ...DemandeAbandonEvents,
  ...DemandeAnnulationAbandonEvents,
  ...DemandeChangementDePuissanceEvents,
  ...UtilisateurEvents,
  ...compatibilityEvents,
};

export const fromRedisMessage = (message: RedisMessage): DomainEvent | null => {
  const EventClass = EventClassByType[message.type];

  if (!EventClass) {
    logger.warning(`Event class not recognized`, { event: message });
    return null;
  }

  const original = isLegacyEvent(message)
    ? {
        version: 1,
        occurredAt: new Date(Number(message.occurredAt)),
      }
    : undefined;

  if (original && isNaN(original.occurredAt.getTime())) {
    throw new Error('message occurredAt is not a valid timestamp');
  }

  const payload = !isLegacyEvent(message)
    ? {
        ...transformerISOStringEnDate(message.payload),
        streamId: message.streamId,
      }
    : {
        ...transformerISOStringEnDate(message.payload),
      };

  return new EventClass({
    payload,
    original,
  });
};
