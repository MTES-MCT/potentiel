import { DomainError } from '@core/domain'

export class MissingPeriodeIdError extends DomainError {
  constructor(public lineNumber: number) {
    super(`La période est manquante à la ligne ${lineNumber}`)
  }
}
