import type { DateTime, Email } from '@potentiel-domain/common';

import type { TypologieInstallation } from '../../../candidature/index.js';
import type { DispositifDeStockage } from '../index.js';

export type ImporterOptions = {
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
  installateur?: string;
  typologieInstallation: TypologieInstallation.ValueType[];
  dispositifDeStockage?: DispositifDeStockage.ValueType;
};
