import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getMotifMainlevéeLabel = (
  motif: Lauréat.GarantiesFinancières.MotifMainlevéeGarantiesFinancières.RawType,
) =>
  match(motif)
    .with('projet-abandonné', () => 'Projet abandonné')
    .with('projet-achevé', () => 'Projet achevé')
    .exhaustive();
