import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeDeDélaiInexistanteError extends InvalidOperationError {
  constructor() {
    super("Aucune demande de délai n'est en cours");
  }
}

export class DemandeDélaiDéjàInstruiteParLeMêmeUtilisateurDreal extends InvalidOperationError {
  constructor() {
    super('La demande de délai est déjà instruite par le même utilisateur dreal');
  }
}
