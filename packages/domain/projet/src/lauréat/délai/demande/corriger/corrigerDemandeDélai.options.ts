import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { MotifDemandeDélai } from '../../index.js';

export type CorrigerDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
  nombreDeMois: number;
  raison: string;
  motif: MotifDemandeDélai.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
};
