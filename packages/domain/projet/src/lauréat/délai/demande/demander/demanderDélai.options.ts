import { Email, DateTime } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../..';

export type DemanderDélaiOptions = {
  nombreDeMois: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};
