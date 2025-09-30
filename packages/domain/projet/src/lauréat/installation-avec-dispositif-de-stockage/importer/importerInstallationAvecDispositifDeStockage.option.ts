import { DateTime, Email } from '@potentiel-domain/common';
import { DispositifDeStockage } from '..';

export type ImporterInstallationAvecDispositifDeStockageOptions = {
  // installationAvecDispositifDeStockage: boolean;
  dispositifDeStockage: DispositifDeStockage.ValueType;
  importéePar: Email.ValueType;
  importéeLe: DateTime.ValueType;
};
