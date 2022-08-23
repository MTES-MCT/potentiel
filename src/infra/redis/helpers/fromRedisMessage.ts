import { DomainEvent } from '@core/domain'
import * as AuthorizationEvents from '@modules/authZ/events'
import * as CandidateNotificationEvents from '@modules/candidateNotification/events'
import * as ModificationRequestEvents from '@modules/modificationRequest/events'
import * as AppelOffreEvents from '@modules/appelOffre/events'
import * as ProjectEvents from '@modules/project/events'
import * as ProjectClaimEvents from '@modules/projectClaim/events'
import * as UserEvents from '@modules/users/events'
import * as FileEvents from '@modules/file/events'
import * as EDFEvents from '@modules/edf/events'
import * as EnedisEvents from '@modules/enedis/events'
import * as LegacyCandidateNotificationEvents from '@modules/legacyCandidateNotification/events'
import * as DemandeDélaiModificationEvents from '@modules/demandeModification/demandeDélai/events'
import * as DemandeRecoursModificationEvents from '@modules/demandeModification/demandeRecours/events'
import * as DemandeDélaiEvents from '@modules/demandeModification/demandeDélai/events'
import * as DemandeAbandonEvents from '@modules/demandeModification/demandeAbandon/events'
import { RedisMessage } from './RedisMessage'

interface EventProps {
  payload: any
  requestId?: string
  original?: {
    occurredAt: Date
    version: number
  }
}

interface HasEventConstructor {
  new (props: EventProps): DomainEvent
}

const EventClassByType: Record<string, HasEventConstructor> = {
  ...ModificationRequestEvents,
  ...CandidateNotificationEvents,
  ...ProjectEvents,
  ...AuthorizationEvents,
  ...AppelOffreEvents,
  ...ProjectClaimEvents,
  ...UserEvents,
  ...LegacyCandidateNotificationEvents,
  ...FileEvents,
  ...EDFEvents,
  ...EnedisEvents,
  ...DemandeDélaiModificationEvents,
  ...DemandeRecoursModificationEvents,
  ...DemandeDélaiEvents,
  ...DemandeAbandonEvents,
}

export const fromRedisMessage = (message: RedisMessage): DomainEvent => {
  const EventClass = EventClassByType[message.type]

  if (!EventClass) {
    throw new Error('Event class not recognized')
  }
  const occurredAt = new Date(Number(message.occurredAt))
  if (isNaN(occurredAt.getTime())) {
    throw new Error('message occurredAt is not a valid timestamp')
  }
  return new EventClass({
    payload: message.payload,
    original: {
      version: 1,
      occurredAt,
    },
  })
}
