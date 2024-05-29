import { IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';

export class RaccordementDéjàExistantError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.RawType) {
    super(`Un raccordement existe déjà pour ce projet`, {
      identifiantProjet: identifiantProjet,
    });
  }
}
