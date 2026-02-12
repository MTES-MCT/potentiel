import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { DossierRaccordement } from './dossierRaccordement.entity.js';

export type RaccordementEntity = Entity<
  'raccordement',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    miseEnService?: {
      date: DateTime.RawType;
      référenceDossierRaccordement: DossierRaccordement['référence'];
    };
  }
>;
