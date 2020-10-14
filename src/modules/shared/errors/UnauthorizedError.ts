import { DomainError } from '../../../core/domain/DomainError'

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Vous n'avez pas la permission d'effectuer cette action.")
  }
}
