import { DomainError } from '@core/domain'

type ErrorDetails = { userId: string }

export class EmailAlreadyUsedError extends DomainError {
  constructor({ userId }: ErrorDetails) {
    super(`Cette adresse email est déjà utilisée pour le compte Potentiel ${userId}.`)
  }
}
