import { DomainError } from '../../../core/domain/DomainError'

export class InfraNotAvailableError extends DomainError {
  constructor() {
    super("Le service demandé n'est pas accessible.")
  }
}
