import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../../index.js';

type DétailCandidatureVérifié = {
  composantsRésilients: string | undefined;
  technologieAoÉolien: 'asynchrone' | 'synchrone' | undefined;
};

export type DétailCandidatureVérifiéEntity = Entity<
  'détail-candidature-vérifié',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: Partial<DétailCandidatureVérifié>;
  }
>;
