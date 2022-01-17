import { DomainError } from '@core/domain'

export class StatusPreventsCancellingError extends DomainError {
  constructor(currentStatus: string) {
    super(`Cette demande ne peut pas être annulée car son status est ${currentStatus}`)
  }
}
