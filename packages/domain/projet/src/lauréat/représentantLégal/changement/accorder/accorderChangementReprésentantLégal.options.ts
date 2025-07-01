import { DateTime, Email } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '../..';

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
