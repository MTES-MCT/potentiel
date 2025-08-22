import type { DateTime, Email } from '@potentiel-domain/common';

import type { TypeReprésentantLégal } from '..';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  dateModification: DateTime.ValueType;
};
