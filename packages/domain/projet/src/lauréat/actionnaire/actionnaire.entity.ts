import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { StatutChangementActionnaire } from '.';

export type ActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;
    actionnaire: { nom: string; miseÀJourLe: DateTime.RawType };
    dernièreDemande?: { date: DateTime.RawType; statut: StatutChangementActionnaire.RawType };
  }
>;
