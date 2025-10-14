import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getStatutLauréatLabel = (type: Lauréat.StatutLauréat.RawType) =>
  match(type)
    .with('abandonné', () => 'Abandonné')
    .with('achevé', () => 'Achevé')
    .with('actif', () => 'Actif')
    .exhaustive();
