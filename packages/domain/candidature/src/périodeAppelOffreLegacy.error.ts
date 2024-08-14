import { InvalidOperationError } from '@potentiel-domain/core';

export class PériodeAppelOffreLegacyError extends InvalidOperationError {
  constructor(appelOffre: string, période: string) {
    super(`Cette période est obsolète et ne peut être importée`, {
      appelOffre,
      période,
    });
  }
}
