import { DomainError } from '@core/domain'

export class IllegalInitialStateForAggregateError extends DomainError {
  constructor() {
    super("L'objet concerné semble endommagé.")
  }
}
