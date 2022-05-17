import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { err, ok, Result } from '@core/utils'
import { EmailAlreadyUsedError, EntityNotFoundError } from '../shared'
import { UserCreated } from './events'
import { UserRole } from './UserRoles'

export interface User extends EventStoreAggregate {
  getUserId: () => Result<string, EntityNotFoundError>
  create: (args: {
    fullName?: string
    role: UserRole
    createdBy?: string
  }) => Result<null, EmailAlreadyUsedError>
}

type UserProps = {
  email: string
  userId: string | undefined
  lastUpdatedOn?: Date
}

export const makeUser = (args: {
  id: UniqueEntityID
  events?: DomainEvent[]
}): Result<User, EntityNotFoundError | EmailAlreadyUsedError> => {
  const { events, id } = args

  const pendingEvents: DomainEvent[] = []

  const props: UserProps = {
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
    getUserId: function () {
      if (!props.userId) {
        return err(new EntityNotFoundError())
      }

      return ok(props.userId)
    },
    create: function ({ fullName, role, createdBy }) {
      const { userId } = props

      if (!userId) {
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
      } else {
        return err(new EmailAlreadyUsedError(userId))
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
