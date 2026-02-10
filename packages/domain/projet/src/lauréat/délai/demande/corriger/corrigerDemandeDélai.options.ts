import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';

export type CorrigerDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
  nombreDeMois: number;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
