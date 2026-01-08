import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';
import { DétailCandidature } from '..';

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature.RawType;
  }
>;
