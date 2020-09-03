import { DomainError } from '../../../core/domain/DomainError'

export class EntityNotFoundError extends DomainError {
  constructor() {
    super("L'objet demandé est introuvable.")
  }
}
