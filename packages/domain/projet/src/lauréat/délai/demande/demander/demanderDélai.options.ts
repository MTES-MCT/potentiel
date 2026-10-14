import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { MotifDemandeDélai } from '../../index.js';

export type DemanderDélaiOptions = {
  nombreDeMois: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
  motif: MotifDemandeDélai.ValueType;
};
