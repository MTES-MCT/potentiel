import { DomainError } from '../../../core/domain/DomainError'

export class EntityAlreadyExistsError extends DomainError {
  constructor() {
    super("L‘identifiant est déjà utilisé.")
  }
}
