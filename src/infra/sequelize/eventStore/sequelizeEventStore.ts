import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { DomainEvent } from '../../../core/domain'
import { ResultAsync } from '../../../core/utils'
import {
  BaseEventStore,
  EventStoreHistoryFilters,
  StoredEvent,
} from '../../../modules/eventStore'
import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotificationForPeriodeFailedPayload,
  CandidateNotifiedForPeriode,
  CandidateNotifiedForPeriodePayload,
} from '../../../modules/candidateNotification/events'
import {
  LegacyProjectEventSourced,
  LegacyProjectEventSourcedPayload,
  LegacyProjectSourced,
  LegacyProjectSourcedPayload,
  PeriodeNotified,
  PeriodeNotifiedPayload,
  ProjectCertificateGenerated,
  ProjectCertificateGeneratedPayload,
  ProjectCertificateGenerationFailed,
  ProjectCertificateGenerationFailedPayload,
  ProjectCertificateUpdated,
  ProjectCertificateUpdatedPayload,
  ProjectCertificateUpdateFailed,
  ProjectCertificateUpdateFailedPayload,
  ProjectDataCorrected,
  ProjectDataCorrectedPayload,
  ProjectDCRDueDateSet,
  ProjectDCRDueDateSetPayload,
  ProjectDCRRemoved,
  ProjectDCRRemovedPayload,
  ProjectDCRSubmitted,
  ProjectDCRSubmittedPayload,
  ProjectGFDueDateSet,
  ProjectGFDueDateSetPayload,
  ProjectGFReminded,
  ProjectGFRemindedPayload,
  ProjectGFRemoved,
  ProjectGFRemovedPayload,
  ProjectGFSubmitted,
  ProjectGFSubmittedPayload,
  ProjectImported,
  ProjectImportedPayload,
  ProjectNotificationDateSet,
  ProjectNotificationDateSetPayload,
  ProjectNotified,
  ProjectNotifiedPayload,
  ProjectReimported,
  ProjectReimportedPayload,
} from '../../../modules/project/events'
import { InfraNotAvailableError } from '../../../modules/shared'

function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input != null
}

const AGGREGATE_ID_SEPARATOR = ' | '

export class SequelizeEventStore extends BaseEventStore {
  private EventStoreModel
  constructor(models) {
    super()
    this.EventStoreModel = models.EventStore
  }

  protected persistEvent(
    event: StoredEvent
  ): ResultAsync<null, InfraNotAvailableError> {
    return ResultAsync.fromPromise(
      this.EventStoreModel.create(this.toPersistance(event)),
      (e: any) => {
        console.log('SequelizeEventStore _persistEvent error', e.message)
        return new InfraNotAvailableError()
      }
    )
  }

  public loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError> {
    // console.log('sequelizeEventStore loadHistory with filters', filters)

    return ResultAsync.fromPromise(
      this.EventStoreModel.findAll(this.toQuery(filters)),
      (e: any) => {
        console.log('SequelizeEventStore _loadHistory error', e.message)
        return new InfraNotAvailableError()
      }
    )
      .map((events: any[]) => {
        // console.log('sequelizeEventStore loadHistory found events', events)
        const payload = filters?.payload
        // Do this in memory for now
        // TODO: create proper sequelize query for payload search
        return payload
          ? events
              .map((item) => item.get())
              .filter((event) =>
                Object.entries(payload).every(
                  ([key, value]) => event.payload[key] === value
                )
              )
          : events
      })
      .map((events: any[]) => {
        // console.log('After filter, events', events)
        return events.map(this.fromPersistance).filter(isNotNullOrUndefined)
      })
  }

  private toPersistance(event: StoredEvent) {
    return {
      id: uuid(),
      type: event.type,
      version: event.getVersion(),
      payload: event.payload,
      aggregateId: Array.isArray(event.aggregateId)
        ? event.aggregateId.join(AGGREGATE_ID_SEPARATOR)
        : event.aggregateId,
      requestId: event.requestId,
      occurredAt: event.occurredAt,
    }
  }

  private fromPersistance(eventRaw: any): StoredEvent | null {
    switch (eventRaw.type) {
      case LegacyProjectEventSourced.type:
        return new LegacyProjectEventSourced({
          payload: eventRaw.payload as LegacyProjectEventSourcedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case LegacyProjectSourced.type:
        return new LegacyProjectSourced({
          payload: eventRaw.payload as LegacyProjectSourcedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case PeriodeNotified.type:
        return new PeriodeNotified({
          payload: eventRaw.payload as PeriodeNotifiedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectCertificateGenerated.type:
        return new ProjectCertificateGenerated({
          payload: eventRaw.payload as ProjectCertificateGeneratedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectCertificateGenerationFailed.type:
        return new ProjectCertificateGenerationFailed({
          payload: eventRaw.payload as ProjectCertificateGenerationFailedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectCertificateUpdated.type:
        return new ProjectCertificateUpdated({
          payload: eventRaw.payload as ProjectCertificateUpdatedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectCertificateUpdateFailed.type:
        return new ProjectCertificateUpdateFailed({
          payload: eventRaw.payload as ProjectCertificateUpdateFailedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectDataCorrected.type:
        return new ProjectDataCorrected({
          payload: eventRaw.payload as ProjectDataCorrectedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectDCRDueDateSet.type:
        return new ProjectDCRDueDateSet({
          payload: eventRaw.payload as ProjectDCRDueDateSetPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectDCRRemoved.type:
        return new ProjectDCRRemoved({
          payload: eventRaw.payload as ProjectDCRRemovedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectDCRSubmitted.type:
        return new ProjectDCRSubmitted({
          payload: eventRaw.payload as ProjectDCRSubmittedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })

      case ProjectGFDueDateSet.type:
        return new ProjectGFDueDateSet({
          payload: eventRaw.payload as ProjectGFDueDateSetPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectGFRemoved.type:
        return new ProjectGFRemoved({
          payload: eventRaw.payload as ProjectGFRemovedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectGFReminded.type:
        return new ProjectGFReminded({
          payload: eventRaw.payload as ProjectGFRemindedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectGFSubmitted.type:
        return new ProjectGFSubmitted({
          payload: eventRaw.payload as ProjectGFSubmittedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectImported.type:
        return new ProjectImported({
          payload: eventRaw.payload as ProjectImportedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectNotificationDateSet.type:
        return new ProjectNotificationDateSet({
          payload: eventRaw.payload as ProjectNotificationDateSetPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectNotified.type:
        return new ProjectNotified({
          payload: eventRaw.payload as ProjectNotifiedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case ProjectReimported.type:
        return new ProjectReimported({
          payload: eventRaw.payload as ProjectReimportedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case CandidateNotificationForPeriodeFailed.type:
        return new CandidateNotificationForPeriodeFailed({
          payload: eventRaw.payload as CandidateNotificationForPeriodeFailedPayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })
      case CandidateNotifiedForPeriode.type:
        return new CandidateNotifiedForPeriode({
          payload: eventRaw.payload as CandidateNotifiedForPeriodePayload,
          requestId: eventRaw.requestId,
          original: {
            version: eventRaw.version,
            occurredAt: eventRaw.occurredAt,
          },
        })

      default:
        console.log(
          'MEGA FAIL: SequelizeEventStore does not recognize this event type (see sequelizeEventStore.fromPersistance for missing type',
          eventRaw.type
        )
        return null
    }
  }

  private toQuery(filters?: EventStoreHistoryFilters) {
    const query: any = {}

    if (filters?.eventType) {
      query.type = filters.eventType
    }

    if (filters?.requestId) {
      query.requestId = filters.requestId
    }

    if (filters?.aggregateId) {
      if (Array.isArray(filters.aggregateId) && filters.aggregateId.length) {
        query.aggregateId = {
          [Op.or]: filters.aggregateId.map((aggregateId) => ({
            [Op.substring]: aggregateId,
          })),
        }
      } else {
        query.aggregateId = {
          [Op.substring]: filters.aggregateId,
        }
      }
    }

    // console.log('toQuery query is', query)

    return {
      where: query,
    }
  }
}
