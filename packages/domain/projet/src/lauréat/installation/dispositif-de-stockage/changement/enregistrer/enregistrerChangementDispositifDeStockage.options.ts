import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../../..';
import { DocumentProjet } from '../../../../..';

export type EnregistrerChangementDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
