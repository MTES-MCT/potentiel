import test from 'node:test';

import { expect } from 'chai';

import type { Candidature } from '@potentiel-domain/projet';

import { applyTemplateToPayload } from './applyTemplateToPayload.js';
import { templateVérificationDétailCandidature } from './templatesVérificationDétailCandidature.js';

const commonExpected: Candidature.DétailCandidatureVérifié = {
  composantsRésilients: undefined,
  technologieAoÉolien: undefined,
  diamètreRotorEnMètres: undefined,
  hauteurBoutDePâleEnMètres: undefined,
  installationRenouvelée: undefined,
  nombreDAérogénérateurs: undefined,
  puissanceUnitaireDesAérogénérateurs: undefined,
  typeTerrainImplantation: undefined,
  noteDegréInnovationSur20: undefined,
  noteInnovation: undefined,
  noteInnovationAdéquationAmbitionsIndustriellesSur5: undefined,
  noteInnovationAspectsEnvironnementauxEtSociauxSur5: undefined,
  noteInnovationPositionnementSurLeMarchéSur10: undefined,
  noteInnovationQualitéTechniqueSur5: undefined,
  notePrix: undefined,
};

test('Doit récupérer les données du payload correspondant au template', () => {
  const payload = {
    'Technologie (AO éolien)': 'Asynchrone',
    'Diamètre du rotor (m) (AO éolien)': '30.9',
    'Hauteur bout de pâle (m) (AO éolien)': '120,22',
    "Nb d'aérogénérateurs (AO éolien)": '2',
    'Puissance unitaire des aérogénérateurs (AO éolien)': '1',
    'Installation renouvellée (AO éolien)': 'Oui',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    ...commonExpected,
    technologieAoÉolien: 'asynchrone',
    diamètreRotorEnMètres: 30.9,
    hauteurBoutDePâleEnMètres: 120.22,
    installationRenouvelée: 'oui',
    nombreDAérogénérateurs: 2,
    puissanceUnitaireDesAérogénérateurs: 1,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Eolien',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});

test("Appel d'offres non concerné par des données de détail vérifiées : ne pas retourner de valeurs non attendues", () => {
  const payload = {
    'Diamètre du rotor (m) (AO éolien)': '30', // propre à l'AO éolien
    'autre clé': 'autre valeur',
  };

  const expected: Candidature.DétailCandidatureVérifié = {
    ...commonExpected,
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});
