import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { DossierRaccordement } from './dossierRaccordement.entity.js';

export type RaccordementEntity = Entity<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    miseEnService?: {
      date: DateTime.RawType;
      référenceDossierRaccordement: DossierRaccordement['référence'];
    };
    désactivé?: true;
  }
>;
