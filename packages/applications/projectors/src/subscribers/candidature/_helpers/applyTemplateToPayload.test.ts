import test from 'node:test';

import { expect } from 'chai';

import type { Candidature } from '@potentiel-domain/projet';

import { applyTemplateToPayload } from './applyTemplateToPayload.js';
import { templateVérificationDétailCandidature } from './templatesVérificationDétailCandidature.js';

test('Template PPE2 EOLIEN csv', () => {
  const payload = { 'Technologie (AO éolien)': 'Asynchrone' };

  const expected: Candidature.DétailCandidatureVérifié = {
    technologieAoÉolien: 'asynchrone',
    composantsRésilients: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Eolien',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});

test('Template CRE4 EOLIEN csv', () => {
  const payload = {
    'Technologie (Modules ou films)': 'Axe horizontal - machines asynchrones',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    technologieAoÉolien: 'asynchrone',
    composantsRésilients: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'Eolien',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});

test('Template PPE2 EOLIEN DN', () => {
  const payload = { Technologie: 'Asynchrone' };

  const expected: Candidature.DétailCandidatureVérifié = {
    technologieAoÉolien: 'asynchrone',
    composantsRésilients: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Eolien',
    typeImport: 'démarches-simplifiées',
  });

  expect(actual).to.deep.equal(expected);
});

test('PPE2 Sol DN', () => {
  const payload = {
    'Composants résilients': 'Polysilicium de qualité photovoltaïque',
    'Technologie (AO éolien)': 'eolien',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    composantsRésilients: 'Polysilicium de qualité photovoltaïque',
    technologieAoÉolien: undefined,
  };
  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'démarches-simplifiées',
  });

  expect(actual).to.deep.equal(expected);
});

test('Autre AO', () => {
  const payload = {
    'autre clé': 'autre valeur',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    composantsRésilients: undefined,
    technologieAoÉolien: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});
