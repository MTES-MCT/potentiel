import { DomainError } from '../../../core/domain'

export class MissingAttestationDesignation extends DomainError {
  constructor() {
    super(`Vous avez oublié de joindre votre attestation de désignation.`)
  }
}
