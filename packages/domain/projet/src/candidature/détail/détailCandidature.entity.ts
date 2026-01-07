import { Entity } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { DétailCandidature } from './détailCandidature.type';

export type DétailCandidatureEntity = Entity<
  'détail-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    statut: 'import' | 'correction';
    dernièreMiseÀJour: {
      date: DateTime.RawType;
      utilisateur: Email.RawType;
    };
    détail: DétailCandidature;
  }
>;
