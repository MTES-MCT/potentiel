import { UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { User } from '../../entities'
import { EventStoreAggregate, StoredEvent } from '../eventStore'
import { EntityNotFoundError, IllegalInitialStateForAggregateError } from '../shared'
import { StatusPreventsAcceptingError } from './errors'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestRejected,
  ResponseTemplateDownloaded,
} from './events'

export interface ModificationRequest extends EventStoreAggregate {
  accept(
    acceptedBy: User,
    params?: ModificationRequestAcceptanceParams
  ): Result<null, StatusPreventsAcceptingError>
  readonly projectId: UniqueEntityID
  readonly status: ModificationRequestStatus
}

export type ModificationRequestStatus = 'envoyée' | 'acceptée' | 'rejetée' | 'annulée'

export type ModificationRequestAcceptanceParams = { newNotificationDate: Date }

interface ModificationRequestProps {
  lastUpdatedOn: Date
  projectId: UniqueEntityID
  hasError: boolean
  status: ModificationRequestStatus
}

export const makeModificationRequest = (args: {
  modificationRequestId: UniqueEntityID
  history: StoredEvent[]
}): Result<ModificationRequest, EntityNotFoundError | IllegalInitialStateForAggregateError> => {
  const { history, modificationRequestId } = args

  if (!history?.length) {
    return err(new EntityNotFoundError())
  }

  const initialProjectId = _getInitialProjectId()
  if (!initialProjectId) {
    return err(new IllegalInitialStateForAggregateError())
  }

  const pendingEvents: StoredEvent[] = []
  const props: ModificationRequestProps = {
    lastUpdatedOn: history[0].occurredAt,
    hasError: false,
    projectId: initialProjectId,
    status: 'envoyée',
  }

  for (const event of history) {
    _processEvent(event)

    if (props.hasError) {
      return err(new IllegalInitialStateForAggregateError())
    }
  }

  // public methods
  return ok({
    accept: function (acceptedBy, params) {
      if (props.status !== 'envoyée') {
        return err(new StatusPreventsAcceptingError(props.status))
      }

      _publishEvent(
        new ModificationRequestAccepted({
          payload: {
            modificationRequestId: modificationRequestId.toString(),
            params,
            acceptedBy: acceptedBy.id,
          },
        })
      )

      return ok(null)
    },
    get pendingEvents() {
      return pendingEvents
    },
    get lastUpdatedOn() {
      return props.lastUpdatedOn
    },
    get projectId() {
      return props.projectId
    },
    get id() {
      return modificationRequestId
    },
    get status() {
      return props.status
    },
  })

  function _publishEvent(event: StoredEvent) {
    pendingEvents.push(event)
    _processEvent(event)
  }

  function _processEvent(event: StoredEvent) {
    switch (event.type) {
      case ModificationRequested.type:
        props.status = 'envoyée'
        break
      case ModificationRequestAccepted.type:
        props.status = 'acceptée'
        break
      case ModificationRequestRejected.type:
        props.status = 'rejetée'
        break
      default:
        // ignore other event types
        break
    }

    _updateLastUpdatedOn(event)
  }

  function _updateLastUpdatedOn(event: StoredEvent) {
    if (event.type !== ResponseTemplateDownloaded.type) {
      props.lastUpdatedOn = event.occurredAt
    }
  }

  function _isModificationRequestedEvent(event: StoredEvent): event is ModificationRequested {
    return event.type === ModificationRequested.type
  }

  function _getInitialProjectId(): UniqueEntityID | null {
    const foundingEvent = history.find(_isModificationRequestedEvent)
    return foundingEvent ? new UniqueEntityID(foundingEvent.payload.projectId) : null
  }
}
