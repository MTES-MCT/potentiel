import { DomainError, DomainEvent, UniqueEntityID } from '@core/domain'
import { String } from 'aws-sdk/clients/cloudsearch'

type IllegalInitialStateForAggregateErrorDetails = {
  projectId: UniqueEntityID
  errorMessage: String
}

export class IllegalInitialStateForAggregateError extends DomainError {
  constructor(public details: IllegalInitialStateForAggregateErrorDetails) {
    super("L'objet concerné semble endommagé.")
  }
}
