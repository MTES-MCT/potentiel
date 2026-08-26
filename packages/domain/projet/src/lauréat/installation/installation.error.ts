import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super("L'installation a déjà été transmise");
  }
}
