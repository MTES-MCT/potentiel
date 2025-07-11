import { Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type DemanderDélaiOptions = {
  nombreDeMois: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};
