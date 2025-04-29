import { InvalidOperationError } from '@potentiel-domain/core';

export class ProducteurDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super('Le producteur a déjà été transmis');
  }
}
