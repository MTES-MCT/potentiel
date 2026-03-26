import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { DispositifDeStockage } from '../../../index.js';

export type EnregistrerChangementDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
