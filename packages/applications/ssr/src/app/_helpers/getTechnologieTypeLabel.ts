import { match } from 'ts-pattern';

import type { Candidature } from '@potentiel-domain/projet';

export const getTechnologieTypeLabel = (type: Candidature.TypeTechnologie.RawType) =>
  match(type)
    .with('pv', () => 'PV')
    .with('hydraulique', () => 'Hydraulique')
    .with('eolien', () => 'Éolien')
    .with('N/A', () => 'N/A')
    .exhaustive();
