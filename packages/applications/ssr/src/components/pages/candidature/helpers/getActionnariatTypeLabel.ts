import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/candidature';

export const getActionnariatTypeLabel = (type: Candidature.TypeActionnariat.RawType): string =>
  match(type)
    .with('financement-collectif', () => 'Financement Collectif')
    .with('financement-participatif', () => 'Financement Participatif')
    .with('gouvernance-partagée', () => 'Gouvernance Partagée')
    .with('investissement-participatif', () => 'Investissement Participatif')
    .exhaustive();
