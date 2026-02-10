import { DateTime, Email } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '../index.js';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  dateModification: DateTime.ValueType;
  raison: string;
};
