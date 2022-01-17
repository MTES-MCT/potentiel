import { DomainError } from '@core/domain'

export class EntityNotFoundError extends DomainError {
  constructor() {
    super("L'objet demandé est introuvable.")
  }
}
