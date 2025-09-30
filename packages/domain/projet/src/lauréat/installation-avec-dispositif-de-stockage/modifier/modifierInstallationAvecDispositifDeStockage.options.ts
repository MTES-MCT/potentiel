import { DateTime, Email } from '@potentiel-domain/common';
import { DispositifDeStockage } from '..';

export type ModifierInstallationAvecDispositifDeStockageOptions = {
  // installationAvecDispositifDeStockage: boolean;
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
};
