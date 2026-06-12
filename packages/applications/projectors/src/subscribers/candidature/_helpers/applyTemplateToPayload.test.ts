import test from 'node:test';

import { expect } from 'chai';

import type { Candidature } from '@potentiel-domain/projet';

import { applyTemplateToPayload } from './applyTemplateToPayload.js';
import {
  templateCRE4EolienDétailCsv,
  templatePPE2EolienDétailCsv,
  templatePPE2SolDétailDn,
} from './templatesVérificationDétailCandidature.js';

test('Template PPE2 EOLIEN', () => {
  const payload = { 'Technologie (AO éolien)': 'Asynchrone' };

  const expected: Candidature.DétailCandidatureVérifiéEntity['détail'] = {
    technologieAoÉolien: 'asynchrone',
  };

  const actual = applyTemplateToPayload(payload, templatePPE2EolienDétailCsv);

  expect(actual).to.deep.equal(expected);
});

test('Template CRE4 EOLIEN', () => {
  const payload = {
    'Technologie (Modules ou films)': 'Axe horizontal - machines asynchrones',
  };

  const expected: Candidature.DétailCandidatureVérifiéEntity['détail'] = {
    technologieAoÉolien: 'asynchrone',
  };

  const actual = applyTemplateToPayload(payload, templateCRE4EolienDétailCsv);

  expect(actual).to.deep.equal(expected);
});

test('Test avec données de payload invalides', () => {
  const payload = {
    'Composants résilients': 'Polysilicium de qualité photovoltaïque',
    'Technologie (AO éolien)': 'eolien',
  };

  const expected: Candidature.DétailCandidatureVérifiéEntity['détail'] = {
    composantsRésilients: 'Polysilicium de qualité photovoltaïque',
  };

  const actual = applyTemplateToPayload(payload, templatePPE2SolDétailDn);

  expect(actual).to.deep.equal(expected);
});
