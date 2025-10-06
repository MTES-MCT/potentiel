import { DateTime, Email } from '@potentiel-domain/common';

export type ModifierInstallateurOptions = {
  identifiantUtilisateur: Email.ValueType;
  installateur: string;
  dateModification: DateTime.ValueType;
};
