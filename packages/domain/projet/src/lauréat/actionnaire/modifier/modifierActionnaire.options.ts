import { IdentifiantProjet, Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
};
