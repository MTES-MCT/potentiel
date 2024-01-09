import { IdentifiantProjet } from '@potentiel-domain/common';
import { NotFoundError } from '@potentiel-domain/core';

export class AucunRaccordementError extends NotFoundError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`Aucun raccordement pour le projet lauréat`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
  }
}
