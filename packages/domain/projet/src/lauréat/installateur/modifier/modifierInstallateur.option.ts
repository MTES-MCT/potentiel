import { DateTime, Email } from '@potentiel-domain/common';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  installateur: string;
  dateModification: DateTime.ValueType;
};
