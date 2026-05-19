import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';
import type { StatutChangementReprésentantLégal, TypeReprésentantLégal } from './index.js';

export type ReprésentantLégalEntity = Entity<
  'représentant-légal',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.RawType;
    dernièreDemande?: { date: DateTime.RawType; statut: StatutChangementReprésentantLégal.RawType };
  }
>;
