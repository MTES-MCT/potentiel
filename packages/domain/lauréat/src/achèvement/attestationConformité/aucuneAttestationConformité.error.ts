import { NotFoundError } from '@potentiel-domain/core';

export class AucuneAttestationConformitéError extends NotFoundError {
  constructor() {
    super(`Il n'y a aucune attestation de conformité pour ce projet`);
  }
}
