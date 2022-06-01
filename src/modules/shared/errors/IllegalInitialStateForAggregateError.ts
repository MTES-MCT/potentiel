import { DomainError, DomainEvent, UniqueEntityID } from '@core/domain'

type IllegalInitialStateForAggregateErrorDetails = {
  projectId: UniqueEntityID
  event?: DomainEvent
}

export class IllegalInitialStateForAggregateError extends DomainError {
  constructor(public details: IllegalInitialStateForAggregateErrorDetails) {
    super("L'objet concerné semble endommagé.")
  }
}
