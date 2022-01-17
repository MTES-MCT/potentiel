import { DomainError } from '@core/domain'

export class EntityAlreadyExistsError extends DomainError {
  constructor() {
    super('L‘identifiant est déjà utilisé.')
  }
}
