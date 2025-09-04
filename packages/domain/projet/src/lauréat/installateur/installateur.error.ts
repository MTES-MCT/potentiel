import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallateurDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super("L'installateur a déjà été transmis");
  }
}
