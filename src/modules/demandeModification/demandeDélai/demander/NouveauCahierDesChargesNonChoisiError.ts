import { DomainError } from '@core/domain'

export class NouveauCahierDesChargesNonChoisiError extends DomainError {
  constructor() {
    super(
      `L'appel d'offre du projet requiert de choisir le nouveau cahier des charges pour faire une demande.`
    )
  }
}
