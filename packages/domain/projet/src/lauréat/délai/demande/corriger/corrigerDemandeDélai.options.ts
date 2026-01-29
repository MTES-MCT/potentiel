import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../..';

export type CorrigerDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
  nombreDeMois: number;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
