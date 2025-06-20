import { Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type EnregistrerChangementOptions = {
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};
