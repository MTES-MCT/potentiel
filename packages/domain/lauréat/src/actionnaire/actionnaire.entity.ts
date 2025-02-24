import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;
    projet: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };
    actionnaire: { nom: string; misÀJourLe: DateTime.RawType };
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
