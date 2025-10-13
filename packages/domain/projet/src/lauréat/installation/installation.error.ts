import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super("L'installation a déjà été transmise");
  }
}

export class NouvelleTypologieInstallationIdentiqueÀLActuelleError extends InvalidOperationError {
  constructor() {
    super('La nouvelle typologie est identique à celle du projet');
  }
}

export class JeuDeTypologiesIdentiquesError extends InvalidOperationError {
  constructor() {
    super('Vous ne pouvez pas sélectionner deux fois la même typologie pour le projet');
  }
}

export class InstallateurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouvel installateur est identique à celui associé au projet');
  }
}

export class DispositifDeStockageDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super(
      "L'information sur le couplage de l'installation avec un dispositif de stockage a déjà été transmise",
    );
  }
}

export class DispositifDeStockageIdentiqueError extends InvalidOperationError {
  constructor() {
    super(
      'Pour enregistrer une modification vous devez renseigner une valeur différente de la valeur actuelle',
    );
  }
}
