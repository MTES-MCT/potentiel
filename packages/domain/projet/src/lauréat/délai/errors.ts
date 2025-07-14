import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeDeDélaiInexistanteError extends InvalidOperationError {
  constructor() {
    super("Aucune demande de délai n'est en cours");
  }
}
