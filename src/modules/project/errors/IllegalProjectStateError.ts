import { DomainError } from '../../../core/domain'

export class IllegalProjectStateError extends DomainError {
  constructor(public error: Record<string, string>) {
    super('Les données du projet présentent des valeurs illégales.')
  }
}
