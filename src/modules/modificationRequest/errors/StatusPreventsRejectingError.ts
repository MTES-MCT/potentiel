import { DomainError } from '@core/domain'

export class StatusPreventsRejectingError extends DomainError {
  constructor(currentStatus: string) {
    super(`Cette demande ne peut pas être refusée car son status est ${currentStatus}`)
  }
}
