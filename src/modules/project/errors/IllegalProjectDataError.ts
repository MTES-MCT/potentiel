import { DomainError } from '@core/domain'

export class IllegalProjectDataError extends DomainError {
  constructor(public errors: Record<number, string>) {
    super('Les données importées présentent des valeurs illégales.')
  }
}
