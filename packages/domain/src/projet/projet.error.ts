import { InvalidOperationError, NotFoundError } from '@potentiel/core-domain';

export class ProjetInconnuError extends NotFoundError {
  constructor() {
    super(`Le projet n'existe pas`);
  }
}

export class GestionnaireRéseauProjetDéjàAjoutéErreur extends InvalidOperationError {
  constructor() {
    super(`Un gestionnaire de réseau a déjà été ajouté au projet`);
  }
}
