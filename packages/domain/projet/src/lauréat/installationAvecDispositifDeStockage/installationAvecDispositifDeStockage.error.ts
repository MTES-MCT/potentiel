import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationAvecDispositifDeStockageDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super(
      "L'information sur le couplage de l'installation avec un dispositif de stockage a déjà été transmise",
    );
  }
}
