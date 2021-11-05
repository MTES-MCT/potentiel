import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { EventStoreAggregate } from '../eventStore'
import { EntityNotFoundError } from '../shared'
import { UserCreated, UserRegistered } from './events'
import { User as OldUser } from '../../entities'

export interface User extends EventStoreAggregate {
  registerFirstLogin(args: { fullName: string; email: string }): Result<null, never>
  getUserId: () => Result<string, EntityNotFoundError>
  create: (args: {
    fullName?: string
    role: OldUser['role']
    createdBy?: string
  }) => Result<null, never>
}

type UserProps = {
  isRegistered: boolean
  email: string
  userId: string | undefined
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
    userId: undefined,
    email: id.toString(),
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
      if (!props.isRegistered && props.userId) {
        _publishEvent(
          new UserRegistered({
            payload: {
              userId: props.userId,
              fullName,
              email,
            },
          })
        )
      }

      return ok(null)
    },
    getUserId: function () {
      if (!props.userId) {
        return err(new EntityNotFoundError())
      }

      return ok(props.userId)
    },
    create: function ({ fullName, role, createdBy }) {
      if (!props.userId) {
        _publishEvent(
          new UserCreated({
            payload: {
              email: props.email,
              userId: new UniqueEntityID().toString(),
              fullName,
              role,
              createdBy,
            },
          })
        )
      }

      return ok(null)
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
