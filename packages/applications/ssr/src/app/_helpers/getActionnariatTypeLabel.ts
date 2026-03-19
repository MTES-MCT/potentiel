import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

export const getActionnariatTypeLabel = (type: Candidature.TypeActionnariat.RawType): string =>
  match(type)
    .with('financement-collectif', () => 'Financement Collectif')
    .with('financement-participatif', () => 'Financement Participatif')
    .with('gouvernance-partagée', () => 'Gouvernance Partagée')
    .with('investissement-participatif', () => 'Investissement Participatif')
    // viovio à voir, peut plutôt être remplacé par un multiselect ?
    .with(
      'financement-collectif-et-gouvernance-partagée',
      () => 'Financement Collectif et gouvernance partagée',
    )
    .exhaustive();
