import test from 'node:test';

import { expect } from 'chai';

import type { Candidature } from '@potentiel-domain/projet';

import { applyTemplateToPayload } from './applyTemplateToPayload.js';
import { templateVérificationDétailCandidature } from './templatesVérificationDétailCandidature.js';

const commonExpected: Candidature.DétailsCandidature = {
  notePrix: undefined,
  pv: {
    typeTerrainImplantation: undefined,
    dateObtentionCETI: undefined,
    natureExacteDuTerrain: undefined,
    surfaceProjetéeAuSol: undefined,
    surfaceTotaleTerrainImplantation: undefined,
    composantsRésilients: undefined,
  },
  innovation: {
    noteDegréInnovationSur20: undefined,
    note: undefined,
    noteAdéquationAmbitionsIndustriellesSur5: undefined,
    noteAspectsEnvironnementauxEtSociauxSur5: undefined,
    notePositionnementSurLeMarchéSur10: undefined,
    noteQualitéTechniqueSur5: undefined,
  },
  éolien: {
    technologie: undefined,
    diamètreRotorEnMètres: undefined,
    hauteurBoutDePâleEnMètres: undefined,
    installationRenouvelée: undefined,
    nombreDAérogénérateurs: undefined,
    puissanceUnitaireDesAérogénérateurs: undefined,
  },
};

test('Doit récupérer les données du payload correspondant au template', () => {
  const payload = {
    'Technologie (AO éolien)': 'Asynchrone',
    'Diamètre du rotor (m) (AO éolien)': '30.9',
    'Hauteur bout de pâle (m) (AO éolien)': '120,22',
    "Nb d'aérogénérateurs (AO éolien)": '2',
    'Puissance unitaire des aérogénérateurs (AO éolien)': '1',
    'Installation renouvellée (AO éolien)': 'Non',
  };

  const expected: Candidature.DétailsCandidature = {
    ...commonExpected,
    éolien: {
      technologie: 'asynchrone',
      diamètreRotorEnMètres: 30.9,
      hauteurBoutDePâleEnMètres: 120.22,
      installationRenouvelée: false,
      nombreDAérogénérateurs: 2,
      puissanceUnitaireDesAérogénérateurs: 1,
    },
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Eolien',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});

test('Donnée non rattachée à un AO spécifique', () => {
  const payload = {
    'Composants résilients': 'test',
  };

  const expected: Candidature.DétailsCandidature = {
    ...commonExpected,
    pv: {
      typeTerrainImplantation: undefined,
      dateObtentionCETI: undefined,
      natureExacteDuTerrain: undefined,
      surfaceProjetéeAuSol: undefined,
      surfaceTotaleTerrainImplantation: undefined,
      composantsRésilients: 'test',
    },
  };

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'démarche-numérique',
  });

  expect(actual).to.deep.equal(expected);
});

test("Appel d'offres non concerné par des données de détail vérifiées : ne pas retourner de valeurs non attendues", () => {
  const payload = {
    'Diamètre du rotor (m) (AO éolien)': '30', // propre à l'AO éolien donc à ignorer pour les autres AOs
    'autre clé': 'autre valeur',
  };

  const expected: Candidature.DétailsCandidature = commonExpected;

  const actual = applyTemplateToPayload(payload, templateVérificationDétailCandidature, {
    appelOffre: 'PPE2 - Sol',
    typeImport: 'csv',
  });

  expect(actual).to.deep.equal(expected);
});
