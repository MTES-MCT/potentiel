import { DomainError } from '@core/domain'

export class DCRDejaEnvoyéError extends DomainError {
  constructor() {
    super('Un document est déjà enregistré pour la demande complète de raccordement de ce projet.')
  }
}
