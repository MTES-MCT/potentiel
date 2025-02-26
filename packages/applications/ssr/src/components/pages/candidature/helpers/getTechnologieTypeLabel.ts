import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/candidature';

export const getTechnologieTypeLabel = (type: Candidature.TypeTechnologie.RawType) =>
  match(type)
    .with('pv', () => 'PV')
    .with('hydraulique', () => 'Hydraulique')
    .with('eolien', () => 'Éolien')
    .with('N/A', () => 'N/A')
    .exhaustive();
