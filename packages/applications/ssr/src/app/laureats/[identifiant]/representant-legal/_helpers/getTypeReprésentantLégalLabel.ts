import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getTypeReprésentantLégalLabel = (
  type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType,
) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();
