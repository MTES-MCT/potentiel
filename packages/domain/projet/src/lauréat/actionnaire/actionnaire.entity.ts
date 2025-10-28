import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;
    actionnaire: { nom: string; miseÀJourLe: DateTime.RawType };
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
