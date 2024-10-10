import { InvalidOperationError } from '@potentiel-domain/core';

export class AttestationNonGénéréeError extends InvalidOperationError {
  constructor() {
    super(`L'attestation d'une candidature non notifiée ne peut pas être régénérée`);
  }
}
