import test from 'node:test';

import { expect } from 'chai';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { récupérerColonnesRequises } from './récupérerColonnesRequises';

const colonnesCommunes = [
  `Appel d'offres`,
  'Période',
  'Famille',
  'N°CRE',
  'Nom projet',
  'Société mère',
  'Candidat',
  'puissance',
  'puissance_projet_initial',
  'prix_reference',
  'Note totale',
  'Nom et prénom du représentant légal',
  'Adresse électronique du contact',
  'N°, voie, lieu-dit 1',
  'N°, voie, lieu-dit 2',
  'CP',
  'Commune',
  'Classé ?',
  "Motif d'élimination",
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  'Technologie\n(dispositif de production)',
  "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation",
  'Financement collectif (Oui/Non)',
  'Gouvernance partagée (Oui/Non)',
  "Date d'échéance au format JJ/MM/AAAA",
  "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO",
];

const champsSupplémentaires: AppelOffre.ChampCandidature[] = [];

test(`Récupérer les colonnes requises de candidature csv sans champs supplémentaires`, async () => {
  // cas : import de plusieurs périodes ; période sans champ supplémentaire
  const actual = await récupérerColonnesRequises({
    champsSupplémentaires,
  });

  expect(actual).to.have.members(colonnesCommunes);
});

test(`Récupérer les colonnes requises de candidature csv avec champs supplémentaires`, async () => {
  const colonnesChampsSupplémentaires = [
    'indexation_k',
    "Date d'obtention de l'autorisation d'urbanisme",
    "Numéro de l'autorisation d'urbanisme",
  ];

  const actual = await récupérerColonnesRequises({
    champsSupplémentaires: [
      ...champsSupplémentaires,
      'coefficientKChoisi',
      'autorisationDUrbanisme',
    ],
  });

  expect(actual).to.have.members([...colonnesCommunes, ...colonnesChampsSupplémentaires]);
});
