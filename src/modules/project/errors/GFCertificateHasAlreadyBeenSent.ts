import { DomainError } from '@core/domain'

export class GFCertificateHasAlreadyBeenSentError extends DomainError {
  constructor() {
    super('Un document est déjà enregistré pour les garanties financières de ce projet.')
  }
}
