import { UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { User } from '../../entities'
import { EventStoreAggregate, StoredEvent } from '../eventStore'
import { EntityNotFoundError, IllegalInitialStateForAggregateError } from '../shared'
import { StatusPreventsAcceptingError } from './errors'
import { ModificationRequested, RecoursAccepted } from './events'

export interface ModificationRequest extends EventStoreAggregate {
  acceptRecours(acceptedBy: User): Result<null, StatusPreventsAcceptingError>
  readonly projectId: UniqueEntityID
  readonly status: ModificationRequestStatus
}

export type ModificationRequestStatus =
  | 'envoyée'
  | 'en instruction'
  | 'acceptée'
  | 'rejetée'
  | 'en appel'
  | 'en appel en instruction'
  | 'en appel acceptée'
  | 'en appel rejetée'
  | 'annulée'

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

  if (!history || !history.length) {
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
    acceptRecours: function (acceptedBy: User) {
      if (props.status !== 'en instruction' && props.status !== 'envoyée') {
        return err(new StatusPreventsAcceptingError(props.status))
      }

      _publishEvent(
        new RecoursAccepted({
          payload: {
            modificationRequestId: modificationRequestId.toString(),
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
        break
      case RecoursAccepted.type:
        props.status = 'acceptée'
        break
      default:
        // ignore other event types
        break
    }

    _updateLastUpdatedOn(event)
  }

  function _updateLastUpdatedOn(event: StoredEvent) {
    props.lastUpdatedOn = event.occurredAt
  }

  function _isModificationRequestedEvent(event: StoredEvent): event is ModificationRequested {
    return event.type === ModificationRequested.type
  }

  function _getInitialProjectId(): UniqueEntityID | null {
    const foundingEvent = history.find(_isModificationRequestedEvent)
    return foundingEvent ? new UniqueEntityID(foundingEvent.payload.projectId) : null
  }
}
