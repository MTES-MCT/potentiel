import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;
    actionnaire: { nom: string; miseÀJourLe: DateTime.RawType };
  } & (
    | { aUneDemandeEnCours: true; dateDernièreDemande: DateTime.RawType }
    | { aUneDemandeEnCours: false; dateDernièreDemande?: DateTime.RawType }
  )
>;
