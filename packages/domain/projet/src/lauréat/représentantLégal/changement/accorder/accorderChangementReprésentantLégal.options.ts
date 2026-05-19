import type { DateTime, Email } from '@potentiel-domain/common';

import type { TypeReprésentantLégal } from '../../index.js';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
} & (
  | {
      nomReprésentantLégal: string;
      typeReprésentantLégal: TypeReprésentantLégal.ValueType;
      accordAutomatique: false;
    }
  | {
      accordAutomatique: true;
    }
);
