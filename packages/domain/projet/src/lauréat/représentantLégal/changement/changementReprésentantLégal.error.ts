import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucun changement de représentant légal n'est en cours`);
  }
}
