import { DomainError } from '@core/domain'

export class StatutIncompatiblePourRejeterDemandeAnnulationAbandonError extends DomainError {
  constructor(public statut: string) {
    super(`Cette demande ne peut pas être rejetée car elle a le statut "${statut}"`)
  }
}
