import { DomainError } from '../../../core/domain'

export class HeterogeneousHistoryError extends DomainError {
  constructor() {
    super('Aggregate history comprises events with different identifiers.')
  }
}
