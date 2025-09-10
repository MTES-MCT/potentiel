import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationAvecDispositifDeStockageDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super(
      "L'information sur le couplage de l'installation avec un dispositif de stockage a déjà été transmise",
    );
  }
}

export class InstallationAvecDispositifDeStockageInchangéError extends InvalidOperationError {
  constructor() {
    super(
      'Pour enregistrer une modification vous devez renseigner une valeur différente de la valeur actuelle',
    );
  }
}
