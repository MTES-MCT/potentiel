import { DomainError } from '@core/domain'

export class MissingAttestationDesignationError extends DomainError {
  constructor(projectName: string) {
    super(`[${projectName}] Vous avez oublié de joindre votre attestation de désignation.`)
  }
}
