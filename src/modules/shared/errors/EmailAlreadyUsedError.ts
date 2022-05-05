import { DomainError } from '@core/domain'

export class EmailAlreadyUsedError extends DomainError {
  constructor() {
    super('Cette adresse mail est déjà utilisée pour un compte Potentiel existant.')
  }
}
