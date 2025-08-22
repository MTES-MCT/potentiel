import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

export type ActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;
    actionnaire: { nom: string; misÀJourLe: DateTime.RawType };
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
