import { DomainError } from '@core/domain'

export class StatutProjetIncompatibleAvecAccordAnnulationAbandonError extends DomainError {
  constructor(public projetId: string) {
    super(
      `Vous ne pouvez pas accorder cette demande d'annulation d'abandon car le projet n'est pas abandonné.`
    )
  }
}
