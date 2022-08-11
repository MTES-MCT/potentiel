import { DomainError } from '@core/domain'

export class PasserEnInstructionDemandeDélaiStatutIncompatibleError extends DomainError {
  constructor() {
    super(`Impossible de passer la demande en instruction si son statut n'est pas 'envoyée'`)
  }
}
