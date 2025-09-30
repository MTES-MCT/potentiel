import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getGarantiesFinancièresDateLabel = (
  type: Lauréat.GarantiesFinancières.GarantiesFinancières.RawType['type'],
): string =>
  match(type)
    .with('exemption', () => 'Date de délibération')
    .with(
      'avec-date-échéance',
      'consignation',
      'garantie-bancaire',
      'six-mois-après-achèvement',
      'type-inconnu',
      () => 'Date de constitution',
    )
    .exhaustive();
