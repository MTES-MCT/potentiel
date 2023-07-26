import { InvalidOperationError, NotFoundError } from '@potentiel/core-domain';

export class ProjetInconnuError extends NotFoundError {
  constructor() {
    super(`Le projet n'existe pas`);
  }
}

export class GestionnaireRéseauProjetDéjàDéclaréErreur extends InvalidOperationError {
  constructor() {
    super(`Un gestionnaire de réseau a déjà été déclaré pour ce projet`);
  }
}

export class TypeGarantiesFinancièresNonAcceptéErreur extends InvalidOperationError {
  constructor() {
    super(`Le type de garanties financières saisi n'est pas accepté`);
  }
}
