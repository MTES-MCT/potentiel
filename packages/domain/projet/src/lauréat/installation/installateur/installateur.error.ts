import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallateurDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super("L'installateur a déjà été transmis");
  }
}

export class InstallateurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouvel installateur est identique à celui associé au projet');
  }
}
