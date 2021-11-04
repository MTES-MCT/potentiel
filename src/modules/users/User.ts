import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { EventStoreAggregate } from '../eventStore'
import { EntityNotFoundError } from '../shared'
import { UserCreated, UserRegistered } from './events'

export interface User extends EventStoreAggregate {
  registerFirstLogin(args: { fullName: string; email: string }): Result<null, never>
  getUserId: () => Result<string, EntityNotFoundError>
}

interface UserProps {
  isRegistered: boolean
  userId: string | null
  lastUpdatedOn?: Date
}

export const makeUser = (args: {
  id: UniqueEntityID
  events?: DomainEvent[]
}): Result<User, EntityNotFoundError> => {
  const { events, id } = args

  const pendingEvents: DomainEvent[] = []

  const props: UserProps = {
    isRegistered: false,
    userId: null,
  }

  if (events) {
    for (const event of events) {
      _processEvent(event)
    }
  }

  function _processEvent(event: DomainEvent) {
    switch (event.type) {
      case UserRegistered.type:
        props.isRegistered = true
        break
      case UserCreated.type:
        props.userId = event.payload.userId
      default:
        // ignore other event types
        break
    }

    _updateLastUpdatedOn(event)
  }

  function _updateLastUpdatedOn(event: DomainEvent) {
    props.lastUpdatedOn = event.occurredAt
  }

  function _publishEvent(event: DomainEvent) {
    pendingEvents.push(event)
    _processEvent(event)
  }

  return ok({
    registerFirstLogin: function ({ fullName, email }) {
      if (!props.isRegistered && props.userId)
        _publishEvent(
          new UserRegistered({
            payload: {
              userId: props.userId,
              fullName,
              email,
            },
          })
        )

      return ok(null)
    },
    getUserId: function () {
      if (!props.userId) {
        return err(new EntityNotFoundError())
      }

      return ok(props.userId)
    },
    get pendingEvents() {
      return pendingEvents
    },
    get lastUpdatedOn() {
      return props.lastUpdatedOn
    },
    get id() {
      // NB: the id of this User aggregate is the email
      return id
    },
  })
}
