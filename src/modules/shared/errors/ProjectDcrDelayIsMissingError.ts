import { DomainError } from '@core/domain'

export class ProjectDcrDelayIsMissingError extends DomainError {
  constructor() {
    super("Il manque le délai de dépôt de la DCR pour l'appel d'offre.")
  }
}
