import { DateTime, Email } from '@potentiel-domain/common';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateModification: DateTime.ValueType;
};
