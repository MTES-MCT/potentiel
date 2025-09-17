import { InvalidOperationError } from '@potentiel-domain/core';

export class ProducteurDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super('Le producteur a déjà été transmis');
  }
}

export class ProducteurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouveau producteur est identique à celui associé au projet');
  }
}

export class AOEmpêcheChangementProducteurError extends InvalidOperationError {
  constructor() {
    super(
      "L'appel d'offres du projet empêche un changement de producteur avant l'achèvement du projet",
    );
  }
}
