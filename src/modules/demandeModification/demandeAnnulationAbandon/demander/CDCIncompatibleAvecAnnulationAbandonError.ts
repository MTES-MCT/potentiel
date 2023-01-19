import { DomainError } from '@core/domain'

export class CDCIncompatibleAvecAnnulationAbandonError extends DomainError {
  constructor(public projetId: string) {
    super(`Le cahier des charges actuel du projet n'autorise pas l'annulation d'abandon.`)
  }
}
