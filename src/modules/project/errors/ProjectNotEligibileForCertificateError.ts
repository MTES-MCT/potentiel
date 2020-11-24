import { DomainError } from '../../../core/domain'

export class ProjectNotEligibleForCertificateError extends DomainError {
  constructor() {
    super('Impossible de générer une attestation pour ce projet.')
  }
}
