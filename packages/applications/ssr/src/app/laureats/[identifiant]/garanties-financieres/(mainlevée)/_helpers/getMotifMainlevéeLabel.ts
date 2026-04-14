import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getMotifMainlevéeLabel = (
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType,
) =>
  match(motif)
    .with('projet-abandonné', () => 'Projet abandonné')
    .with('projet-achevé', () => 'Projet achevé')
    .exhaustive();
