import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

export const getGarantiesFinancièresTypeLabel = (
  type: Candidature.TypeGarantiesFinancières.RawType,
) =>
  match(type)
    .with('consignation', () => `Consignation`)
    .with('avec-date-échéance', () => `Avec date d'échéance`)
    .with('six-mois-après-achèvement', () => `Six mois après achèvement`)
    .with('exemption', () => 'Exemption')
    .with('type-inconnu', () => ``)
    .exhaustive();
