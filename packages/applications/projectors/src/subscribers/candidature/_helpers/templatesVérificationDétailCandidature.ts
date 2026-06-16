import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';

const getTechnologieEolien = (
  value?: string,
): Candidature.DétailCandidatureVérifié['technologieAoÉolien'] => {
  if (!value) return undefined;
  const v = value.toLowerCase();

  if (v.includes('asynchrone')) return 'asynchrone';
  if (v.includes('synchrone')) return 'synchrone';

  return undefined;
};
const noop = <T>(value: T) => value;

export const templateVérificationDétailCandidature: Template<Candidature.DétailCandidatureVérifié> =
  {
    technologieAoÉolien: {
      labels: [
        [{ appelOffre: 'Eolien' }, 'Technologie (Modules ou films)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Technologie (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' }, 'Technologie'],
      ],
      mapper: getTechnologieEolien,
    },
    composantsRésilients: {
      labels: [
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarches-simplifiées' },
          'Composants résilients',
        ],
      ],
      mapper: noop,
    },
  };
