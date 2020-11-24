import { DomainError } from '../../../core/domain'

export class IllegalProjectDataError extends DomainError {
  constructor(public errorsInFields: Record<string, string>) {
    super(
      'Champs erronés: ' +
        Object.entries(errorsInFields)
          .map(([key, value]) => `${key} (${value})`)
          .join(', ')
    )
  }
}
