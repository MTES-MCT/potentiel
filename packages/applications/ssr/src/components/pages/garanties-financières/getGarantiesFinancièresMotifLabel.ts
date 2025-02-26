import { match } from 'ts-pattern';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const getGarantiesFinancièresMotifLabel = (
  type: GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
) =>
  match(type)
    .with('changement-producteur', () => 'Changement de producteur')
    .with('recours-accordé', () => 'Recours accordé')
    .with(
      'échéance-garanties-financières-actuelles',
      () => 'Garanties financières arrivées à échéance',
    )
    .with('motif-inconnu', () => 'Inconnu')
    .exhaustive();
