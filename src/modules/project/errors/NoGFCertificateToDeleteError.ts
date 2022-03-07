import { DomainError } from '@core/domain'

export class NoGFCertificateToDeleteError extends DomainError {
  constructor() {
    super("Il n'y a aucun document à supprimer concernant les garanties financières.")
  }
}
