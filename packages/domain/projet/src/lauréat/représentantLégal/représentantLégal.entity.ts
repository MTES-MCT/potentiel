import { Entity } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

import { TypeReprésentantLégal } from './index.js';

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
