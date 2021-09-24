import { DomainError } from '../../../core/domain'

export class MissingAttestationDesignation extends DomainError {
  constructor(projectName: string) {
    super(`[${projectName}] Vous avez oublié de joindre votre attestation de désignation.`)
  }
}
