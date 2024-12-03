import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { ReprésentantLégal } from '.';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    représentantLégal?: {
      nom: string;
      type: ReprésentantLégal.TypeReprésentantLégal.RawType;
    };
    actionnaire: { nom: String; dernièreMiseÀJourLe: DateTime.RawType };
  }
>;
