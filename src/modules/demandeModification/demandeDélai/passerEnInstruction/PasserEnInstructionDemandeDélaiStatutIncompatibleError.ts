import { DomainError } from '@core/domain'
import { StatutDemandeDélai } from '../DemandeDélai'

export class PasserEnInstructionDemandeDélaiStatutIncompatibleError extends DomainError {
  constructor(public statut?: StatutDemandeDélai) {
    super(
      statut
        ? `Impossible de passer la demande en instruction car son statut ${statut} n'est pas égale à 'envoyée'`
        : `Impossible de passer la demande en instruction car celle-ci n'a pas de statut`
    )
  }
}
