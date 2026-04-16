import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getStatutMainlevéeLabel = (
  statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
) =>
  match(statut)
    .with('demandé', () => 'Demandé')
    .with('en-instruction', () => 'En instruction')
    .with('accordé', () => 'Accordé')
    .with('rejeté', () => 'Rejeté')
    .exhaustive();
