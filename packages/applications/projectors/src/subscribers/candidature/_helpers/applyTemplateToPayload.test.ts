import test from 'node:test';

import { expect } from 'chai';

import type { Candidature } from '@potentiel-domain/projet';

import { applyTemplateToPayload } from './applyTemplateToPayload.js';
import { templateVérificationDétailCandidature } from './templatesVérificationDétailCandidature.js';

test('Template PPE2 EOLIEN csv', () => {
  const payload = {
    'Technologie (AO éolien)': 'Asynchrone',
    'Diamètre du rotor (m) (AO éolien)': '30',
    'Hauteur bout de pâle (m) (AO éolien)': '120',
    "Nb d'aérogénérateurs (AO éolien)": '2',
    'Puissance unitaire des aérogénérateurs (AO éolien)': '1',
    'Installation renouvellée (AO éolien)': 'Oui',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    technologieAoÉolien: 'asynchrone',
    diamètreRotorEnMètres: '30',
    hauteurBoutDePâleEnMètres: '120',
    installationRenouvelée: 'non',
    nombreDAérogénérateurs: '2',
    puissanceUnitaireDesAérogénérateurs: '1',
    typeTerrainImplantation: undefined,
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
    diamètreRotorEnMètres: undefined,
    hauteurBoutDePâleEnMètres: undefined,
    installationRenouvelée: undefined,
    nombreDAérogénérateurs: undefined,
    puissanceUnitaireDesAérogénérateurs: undefined,
    typeTerrainImplantation: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'Eolien',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});

test('Template PPE2 EOLIEN DN', () => {
  const payload = {
    Technologie: 'Asynchrone',
    'Diamètre du rotor': '30',
    'Hauteur en bout de pale': '120',
    "Nombre d'aérogénérateurs": '2',
    'Puissance unitaire des aérogénérateurs': '1',
    "L'installation est-elle renouvelée ?": 'false',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    technologieAoÉolien: 'asynchrone',
    diamètreRotorEnMètres: '30',
    hauteurBoutDePâleEnMètres: '120',
    installationRenouvelée: 'non',
    nombreDAérogénérateurs: '2',
    puissanceUnitaireDesAérogénérateurs: '1',
    typeTerrainImplantation: undefined,
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
    "Type de cas du terrain d'implantation": 'Cas 2 bis',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    composantsRésilients: 'Polysilicium de qualité photovoltaïque',
    technologieAoÉolien: undefined,
    diamètreRotorEnMètres: undefined,
    hauteurBoutDePâleEnMètres: undefined,
    installationRenouvelée: undefined,
    nombreDAérogénérateurs: undefined,
    puissanceUnitaireDesAérogénérateurs: undefined,
    typeTerrainImplantation: 'Cas 2 bis',
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
    diamètreRotorEnMètres: undefined,
    hauteurBoutDePâleEnMètres: undefined,
    installationRenouvelée: undefined,
    nombreDAérogénérateurs: undefined,
    puissanceUnitaireDesAérogénérateurs: undefined,
    typeTerrainImplantation: undefined,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});
