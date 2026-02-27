import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getGarantiesFinancièresMotifLabel = (
  type: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
) =>
  match(type)
    .with('changement-producteur', () => 'Changement de producteur')
    .with('recours-accordé', () => 'Recours accordé')
    .with(
      'échéance-garanties-financières-actuelles',
      () => 'Garanties financières arrivées à échéance',
    )
    .with('non-déposé', () => 'Garanties financières non déposées')
    .exhaustive();
