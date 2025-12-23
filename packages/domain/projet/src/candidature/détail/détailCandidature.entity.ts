import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';

import { DétailCandidature } from './détailCandidature.type';

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: 'import' | 'correction';
    détail: DétailCandidature;
  }
>;
