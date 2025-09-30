import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getGarantiesFinancièresDateLabel = (
  type: Lauréat.GarantiesFinancières.GarantiesFinancières.RawType['type'],
): string =>
  match(type)
    .with('exemption', () => "Date de délibération de l'exemption de garanties financières")
    .with(
      'avec-date-échéance',
      'consignation',
      'six-mois-après-achèvement',
      'type-inconnu',
      () => 'Date de constitution des garanties financières',
    )
    .exhaustive();
