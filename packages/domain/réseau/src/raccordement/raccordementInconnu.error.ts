import { IdentifiantProjet } from '@potentiel-domain/common';
import { NotFoundError } from '@potentiel-domain/core';

export class RaccordementInconnuError extends NotFoundError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`Raccordement inconnu`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
  }
}
