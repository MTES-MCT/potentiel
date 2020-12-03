import { DomainError } from '../../../core/domain'

export class StatusPreventsAcceptingError extends DomainError {
  constructor(currentStatus: string) {
    super(`Cette demande ne peut pas être acceptée car son status est ${currentStatus}`)
  }
}
