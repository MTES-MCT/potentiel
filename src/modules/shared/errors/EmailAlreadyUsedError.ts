import { DomainError } from '@core/domain'

export class EmailAlreadyUsedError extends DomainError {
  constructor(public userId: string) {
    super(`Cette adresse email est déjà utilisée pour un compte Potentiel existant.`)
  }
}
