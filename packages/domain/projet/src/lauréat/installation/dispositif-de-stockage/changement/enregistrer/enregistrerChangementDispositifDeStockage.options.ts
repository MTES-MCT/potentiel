import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { DispositifDeStockage } from '../../../index.js';

export type EnregistrerChangementDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
