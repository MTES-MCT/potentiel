import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export const getGarantiesFinancièresAttestationLabel = (
  type: Lauréat.GarantiesFinancières.GarantiesFinancières.RawType['type'],
): string =>
  match(type)
    .with('exemption', () => 'Délibération approuvant le projet objet de l’offre')
    .with(
      'avec-date-échéance',
      'consignation',
      'six-mois-après-achèvement',
      'type-inconnu',
      () => 'Attestation de constitution des garanties financières',
    )
    .exhaustive();
