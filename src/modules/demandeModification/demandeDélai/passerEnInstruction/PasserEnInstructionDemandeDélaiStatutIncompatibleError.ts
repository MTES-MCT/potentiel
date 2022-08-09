import { DomainError } from '@core/domain'
import { StatutDemandeDélai } from '../DemandeDélai'

export class PasserEnInstructionDemandeDélaiStatutIncompatibleError extends DomainError {
  constructor() {
    super(`Impossible de passer la demande en instruction car si son statut n'est pas 'envoyée'`)
  }
}
