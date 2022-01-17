import { DomainError } from '@core/domain'

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Vous n'avez pas la permission d'effectuer cette action.")
  }
}
