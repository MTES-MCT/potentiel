import { DateTime, Email } from '@potentiel-domain/common';

export type ImporterInstallationAvecDispositifDeStockageOptions = {
  installationAvecDispositifDeStockage: boolean;
  importéePar: Email.ValueType;
  importéeLe: DateTime.ValueType;
};
