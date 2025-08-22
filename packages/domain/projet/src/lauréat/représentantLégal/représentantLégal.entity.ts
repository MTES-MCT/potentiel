import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../..';
import type { TypeReprésentantLégal } from '.';

export type ReprésentantLégalEntity = Entity<
  'représentant-légal',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;

    demandeEnCours?: {
      demandéLe: DateTime.RawType;
    };
  }
>;
