import { DomainError } from '@core/domain'

export class StatutDemandeIncompatibleAvecAccordAnnulationAbandonError extends DomainError {
  constructor(public demandeId: string) {
    super(
      `Vous ne pouvez pas accorder cette demande d'annulation d'abandon car son statut n'est pas "envoyée".`
    )
  }
}
