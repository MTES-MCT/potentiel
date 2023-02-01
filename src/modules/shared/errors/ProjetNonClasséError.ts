import { DomainError } from '@core/domain'

export class ProjetNonClasséError extends DomainError {
  constructor() {
    super(`Le projet doit être classé pour pouvoir être mis à jour`)
  }
}
