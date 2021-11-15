import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { DomainEvent } from '../../../core/domain'
import { logger, ResultAsync, wrapInfra } from '../../../core/utils'
import * as AuthorizationEvents from '../../../modules/authZ/events'
import * as CandidateNotificationEvents from '../../../modules/candidateNotification/events'
import * as ModificationRequestEvents from '../../../modules/modificationRequest/events'
import * as AppelOffreEvents from '../../../modules/appelOffre/events'
import * as ProjectEvents from '../../../modules/project/events'
import * as ProjectClaimEvents from '../../../modules/projectClaim/events'
import * as UserEvents from '../../../modules/users/events'
import * as LegacyCandidateNotificationEvents from '../../../modules/legacyCandidateNotification/events'
import { InfraNotAvailableError } from '../../../modules/shared'
import { BaseEventStore } from '../../eventStore'

function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input != null
}

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
}

export class SequelizeEventStore extends BaseEventStore {
  private EventStoreModel
  constructor(models) {
    super()
    this.EventStoreModel = models.EventStore
  }

  protected persistEvents(events: DomainEvent[]): ResultAsync<null, InfraNotAvailableError> {
    return wrapInfra(this.EventStoreModel.bulkCreate(events.map(this.toPersistance)))
  }

  public loadHistory(aggregateId: string): ResultAsync<DomainEvent[], InfraNotAvailableError> {
    return wrapInfra(this.EventStoreModel.findAll(this.toQuery(aggregateId)))
      .map((events: any[]) => events.map((item) => item.get()))
      .map((events: any[]) => {
        return events.map(this.fromPersistance).filter(isNotNullOrUndefined)
      })
  }

  private toPersistance(event: DomainEvent) {
    return {
      id: uuid(),
      type: event.type,
      version: event.getVersion(),
      payload: event.payload,
      aggregateId:
        event.aggregateId &&
        (Array.isArray(event.aggregateId) ? event.aggregateId : [event.aggregateId]),
      requestId: event.requestId,
      occurredAt: event.occurredAt,
    }
  }

  private fromPersistance(eventRaw: any): DomainEvent | null {
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
      },
    })
  }

  private toQuery(aggregateId) {
    return {
      where: {
        aggregateId: {
          [Op.overlap]: [aggregateId],
        },
      },
    }
  }
}
