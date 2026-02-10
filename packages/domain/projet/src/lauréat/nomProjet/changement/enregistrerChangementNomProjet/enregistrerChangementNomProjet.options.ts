import { Email, DateTime } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';

export type EnregistrerChangementNomProjetOptions = {
  enregistréPar: Email.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
