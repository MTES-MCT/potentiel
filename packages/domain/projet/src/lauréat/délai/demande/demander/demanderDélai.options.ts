import { Email, DateTime } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';

export type DemanderDélaiOptions = {
  nombreDeMois: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};
