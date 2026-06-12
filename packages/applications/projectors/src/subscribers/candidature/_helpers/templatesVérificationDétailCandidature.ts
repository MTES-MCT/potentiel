import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';

export const commonTemplate: Template<Candidature.DétailCandidatureVérifiéEntity['détail']> = {
  composantsRésilients: undefined,
  technologieAoÉolien: undefined,
};

const getTechnologieEolien = (
  value: string,
): Candidature.DétailCandidatureVérifiéEntity['détail']['technologieAoÉolien'] => {
  const v = value.toLowerCase();

  if (v.includes('asynchrone')) return 'asynchrone';
  if (v.includes('synchrone')) return 'synchrone';

  return undefined;
};

export const templateCRE4EolienDétailCsv: Template<
  Candidature.DétailCandidatureVérifiéEntity['détail']
> = {
  ...commonTemplate,
  technologieAoÉolien: {
    label: 'Technologie (Modules ou films)',
    mapper: getTechnologieEolien,
  },
};

export const templatePPE2EolienDétailCsv: Template<
  Candidature.DétailCandidatureVérifiéEntity['détail']
> = {
  ...commonTemplate,
  technologieAoÉolien: {
    label: 'Technologie (AO éolien)',
    mapper: getTechnologieEolien,
  },
};

export const templatePPE2EolienDétailDn: Template<
  Candidature.DétailCandidatureVérifiéEntity['détail']
> = {
  ...commonTemplate,
  technologieAoÉolien: {
    label: 'Technologie',
    mapper: getTechnologieEolien,
  },
};

export const templatePPE2SolDétailDn: Template<
  Candidature.DétailCandidatureVérifiéEntity['détail']
> = {
  ...commonTemplate,
  composantsRésilients: {
    label: 'Composants résilients',
    mapper: (value: string) => value,
  },
};
