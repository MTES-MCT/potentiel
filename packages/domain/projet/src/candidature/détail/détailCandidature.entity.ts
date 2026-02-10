import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../index.js';
import { DétailCandidature } from '../index.js';

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature.RawType;
  }
>;
