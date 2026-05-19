import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';
import type { DétailCandidature } from '../index.js';

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature.RawType;
  }
>;
