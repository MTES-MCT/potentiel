import { DomainError } from '@core/domain'

export class StatutRéponseIncompatibleAvecAnnulationError extends DomainError {
  constructor(currentStatus: string) {
    super(`Vous ne pouvez pas annuler cette réponse car la demande est en statut ${currentStatus}`)
  }
}
