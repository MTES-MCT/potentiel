import { Email, DateTime } from '@potentiel-domain/common';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  dateModification: DateTime.ValueType;
  raison?: string;
};
