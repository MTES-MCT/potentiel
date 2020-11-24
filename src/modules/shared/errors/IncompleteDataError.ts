import { DomainError } from '../../../core/domain'

export class IncompleteDataError extends DomainError {
  constructor() {
    super('Les données ne sont pas suffisantes pour cette vue.')
  }
}
