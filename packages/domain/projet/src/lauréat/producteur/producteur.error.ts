import { InvalidOperationError } from '@potentiel-domain/core';

export class ProducteurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouveau producteur est identique à celui associé au projet');
  }
}

export class AOEmpêcheChangementProducteurError extends InvalidOperationError {
  constructor() {
    super(
      "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet",
    );
  }
}
