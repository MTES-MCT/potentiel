import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationAvecDispositifDeStockageDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super("L'indication sur l'installation avec dispositif de stockage a déjà été transmise");
  }
}
