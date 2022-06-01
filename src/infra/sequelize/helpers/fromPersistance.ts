import { DomainEvent } from '@core/domain'
import { logger } from '@core/utils'
import * as AuthorizationEvents from '@modules/authZ/events'
import * as CandidateNotificationEvents from '@modules/candidateNotification/events'
import * as ModificationRequestEvents from '@modules/modificationRequest/events'
import * as AppelOffreEvents from '@modules/appelOffre/events'
import * as ProjectEvents from '@modules/project/events'
import * as ProjectClaimEvents from '@modules/projectClaim/events'
import * as UserEvents from '@modules/users/events'
import * as EDFEvents from '@modules/edf/events'
import * as EnedisEvents from '@modules/enedis/events'
import * as LegacyCandidateNotificationEvents from '@modules/legacyCandidateNotification/events'

interface EventProps {
  payload: any
  requestId?: string
  original?: {
    occurredAt: Date
    version: number
    eventId: string
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
  ...EDFEvents,
  ...EnedisEvents,
}

export const fromPersistance = (eventRaw: any): DomainEvent | null => {
  const EventClass = EventClassByType[eventRaw.type]

  if (!EventClass) {
    logger.error(
      `MEGA FAIL: SequelizeEventStore does not recognize this event type (see sequelizeEventStore.fromPersistance for missing type ${eventRaw.type}`
    )
    return null
  }

  return new EventClass({
    payload: eventRaw.payload,
    requestId: eventRaw.requestId?.toString(),
    original: {
      version: eventRaw.version,
      occurredAt: new Date(eventRaw.occurredAt),
      eventId: eventRaw.id,
    },
  })
}
