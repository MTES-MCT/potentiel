import { InvalidOperationError } from '@potentiel-domain/core';

export class InstallationDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super("L'installation a déjà été transmise");
  }
}

export class TypologieInstallationIdentiqueError extends InvalidOperationError {
  constructor() {
    super("La typologie d'installation est identique");
  }
}

export class InstallateurIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouvel installateur est identique à celui associé au projet');
  }
}
