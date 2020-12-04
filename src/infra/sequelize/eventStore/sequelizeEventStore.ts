import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { ResultAsync } from '../../../core/utils'
import { BaseEventStore, EventStoreHistoryFilters, StoredEvent } from '../../../modules/eventStore'

import {
  ModificationRequested,
  ModificationRequestedPayload,
  RecoursAccepted,
  RecoursAcceptedPayload,
  ResponseTemplateDownloaded,
  ResponseTemplateDownloadedPayload,
} from '../../../modules/modificationRequest/events'
import {
  CandidateInformationOfCertificateUpdateFailed,
  CandidateInformationOfCertificateUpdateFailedPayload,
  CandidateInformedOfCertificateUpdate,
  CandidateInformedOfCertificateUpdatePayload,
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
  ProjectCertificateRegenerated,
  ProjectCertificateRegeneratedPayload,
  ProjectCertificateGenerationFailed,
  ProjectCertificateGenerationFailedPayload,
  ProjectCertificateDownloaded,
  ProjectCertificateDownloadedPayload,
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
  ProjectClasseGranted,
  ProjectClasseGrantedPayload,
  ProjectCertificateUploaded,
  ProjectCertificateUpdateFailed,
  ProjectCertificateUpdatedPayload,
  ProjectCertificateUpdateFailedPayload,
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

  protected persistEvents(events: StoredEvent[]): ResultAsync<null, InfraNotAvailableError> {
    return ResultAsync.fromPromise(
      this.EventStoreModel.bulkCreate(events.map(this.toPersistance)),
      (e: any) => {
        console.log('SequelizeEventStore _persistEvent error', e.message)
        return new InfraNotAvailableError()
      }
    )
  }

  public loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError> {
    return ResultAsync.fromPromise(
      this.EventStoreModel.findAll(this.toQuery(filters)),
      (e: any) => {
        console.log('SequelizeEventStore _loadHistory error', e.message)
        return new InfraNotAvailableError()
      }
    )
      .map((events: any[]) => events.map((item) => item.get()))
      .map((events: any[]) => {
        const payload = filters?.payload

        // Do this in memory for now
        // TODO: create proper sequelize query for payload search
        return payload
          ? events.filter((event) =>
              Object.entries(payload).every(([key, value]) => event.payload[key] === value)
            )
          : events
      })
      .map((events: any[]) => {
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
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case LegacyProjectSourced.type:
        return new LegacyProjectSourced({
          payload: eventRaw.payload as LegacyProjectSourcedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case PeriodeNotified.type:
        return new PeriodeNotified({
          payload: eventRaw.payload as PeriodeNotifiedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateGenerated.type:
        return new ProjectCertificateGenerated({
          payload: eventRaw.payload as ProjectCertificateGeneratedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateRegenerated.type:
        return new ProjectCertificateRegenerated({
          payload: eventRaw.payload as ProjectCertificateRegeneratedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateGenerationFailed.type:
        return new ProjectCertificateGenerationFailed({
          payload: eventRaw.payload as ProjectCertificateGenerationFailedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateUploaded.type:
        return new ProjectCertificateUploaded({
          payload: eventRaw.payload as ProjectCertificateUpdatedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateUpdateFailed.type:
        return new ProjectCertificateUpdateFailed({
          payload: eventRaw.payload as ProjectCertificateUpdateFailedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectCertificateDownloaded.type:
        return new ProjectCertificateDownloaded({
          payload: eventRaw.payload as ProjectCertificateDownloadedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectDataCorrected.type:
        return new ProjectDataCorrected({
          payload: eventRaw.payload as ProjectDataCorrectedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectDCRDueDateSet.type:
        return new ProjectDCRDueDateSet({
          payload: eventRaw.payload as ProjectDCRDueDateSetPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectDCRRemoved.type:
        return new ProjectDCRRemoved({
          payload: eventRaw.payload as ProjectDCRRemovedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectDCRSubmitted.type:
        return new ProjectDCRSubmitted({
          payload: eventRaw.payload as ProjectDCRSubmittedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })

      case ProjectGFDueDateSet.type:
        return new ProjectGFDueDateSet({
          payload: eventRaw.payload as ProjectGFDueDateSetPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectGFRemoved.type:
        return new ProjectGFRemoved({
          payload: eventRaw.payload as ProjectGFRemovedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectGFReminded.type:
        return new ProjectGFReminded({
          payload: eventRaw.payload as ProjectGFRemindedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectGFSubmitted.type:
        return new ProjectGFSubmitted({
          payload: eventRaw.payload as ProjectGFSubmittedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectImported.type:
        return new ProjectImported({
          payload: eventRaw.payload as ProjectImportedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectNotificationDateSet.type:
        return new ProjectNotificationDateSet({
          payload: eventRaw.payload as ProjectNotificationDateSetPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectNotified.type:
        return new ProjectNotified({
          payload: eventRaw.payload as ProjectNotifiedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectClasseGranted.type:
        return new ProjectClasseGranted({
          payload: eventRaw.payload as ProjectClasseGrantedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ProjectReimported.type:
        return new ProjectReimported({
          payload: eventRaw.payload as ProjectReimportedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case CandidateNotificationForPeriodeFailed.type:
        return new CandidateNotificationForPeriodeFailed({
          payload: eventRaw.payload as CandidateNotificationForPeriodeFailedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case CandidateNotifiedForPeriode.type:
        return new CandidateNotifiedForPeriode({
          payload: eventRaw.payload as CandidateNotifiedForPeriodePayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case CandidateInformedOfCertificateUpdate.type:
        return new CandidateInformedOfCertificateUpdate({
          payload: eventRaw.payload as CandidateInformedOfCertificateUpdatePayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case CandidateInformationOfCertificateUpdateFailed.type:
        return new CandidateInformationOfCertificateUpdateFailed({
          payload: eventRaw.payload as CandidateInformationOfCertificateUpdateFailedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ModificationRequested.type:
        return new ModificationRequested({
          payload: eventRaw.payload as ModificationRequestedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case RecoursAccepted.type:
        return new RecoursAccepted({
          payload: eventRaw.payload as RecoursAcceptedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
          },
        })
      case ResponseTemplateDownloaded.type:
        return new ResponseTemplateDownloaded({
          payload: eventRaw.payload as ResponseTemplateDownloadedPayload,
          requestId: eventRaw.requestId?.toString(),
          original: {
            version: eventRaw.version,
            occurredAt: new Date(eventRaw.occurredAt),
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

    return {
      where: query,
    }
  }
}
