import { Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
};
