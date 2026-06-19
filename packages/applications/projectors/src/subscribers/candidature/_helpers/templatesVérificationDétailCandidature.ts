import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';
import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const getTechnologieEolien = (
  value?: string,
): Candidature.DétailsCandidature['technologieAoÉolien'] => {
  if (!value) return undefined;
  const v = value.toLowerCase();

  if (v.includes('asynchrone')) return 'asynchrone';
  if (v.includes('synchrone')) return 'synchrone';

  return undefined;
};

const getOuiNon = (value?: string): 'oui' | 'non' | undefined => {
  if (!value) return undefined;
  const v = value.toLowerCase();

  if (v.includes('oui')) return 'oui';
  if (v.includes('non')) return 'non';
  if (v.includes('true')) return 'oui';
  if (v.includes('false')) return 'non';

  return undefined;
};

const getNumber = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  const number = Number(value.replace(',', '.'));
  return Number.isNaN(number) ? undefined : number;
};

const noop = <T>(value: T) => value;

export const templateVérificationDétailCandidature: Template<Candidature.DétailsCandidature> = {
  technologieAoÉolien: {
    labels: [
      [{ appelOffre: 'Eolien' }, 'Technologie (Modules ou films)'],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Technologie (AO éolien)'],
      [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Technologie (AO éolien)'],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' }, 'Technologie'],
    ],
    mapper: getTechnologieEolien,
  },
  diamètreRotorEnMètres: {
    labels: [
      [{ appelOffre: 'Eolien' }, 'Diamètre du rotor (m) (AO éolien)'],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
      [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' }, 'Diamètre du rotor'],
    ],
    mapper: getNumber,
  },
  hauteurBoutDePâleEnMètres: {
    labels: [
      [{ appelOffre: 'Eolien' }, 'Hauteur bout de pâle (m) (AO éolien)'],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Hauteur bout de pâle (m) (AO éolien)'],
      [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Hauteur bout de pâle (m) (AO éolien)'],
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
        'Hauteur en bout de pale',
      ],
    ],
    mapper: getNumber,
  },
  nombreDAérogénérateurs: {
    labels: [
      [{ appelOffre: 'Eolien' }, "Nb d'aérogénérateurs (AO éolien)"],
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
      [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
        "Nombre d'aérogénérateurs",
      ],
    ],
    mapper: getNumber,
  },
  puissanceUnitaireDesAérogénérateurs: {
    labels: [
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
        'Puissance unitaire des aérogénérateurs (AO éolien)',
      ],
      [
        { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
        'Puissance unitaire des aérogénérateurs (AO éolien)',
      ],
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
        'Puissance unitaire des aérogénérateurs',
      ],
    ],
    mapper: getNumber,
  },
  installationRenouvelée: {
    labels: [
      [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Installation renouvellée (AO éolien)'],
      [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Installation renouvellée (AO éolien)'],
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
        "L'installation est-elle renouvelée ?",
      ],
    ],
    mapper: getOuiNon,
  },
  typeTerrainImplantation: {
    labels: [
      [
        { appelOffre: 'Fessenheim', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'CRE4 - ZNI 2017', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'CRE4 - ZNI', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'CRE4 - Sol', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Sol', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Autoconsommation métropole', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - ZNI', typeImport: 'csv' },
        "Type de terrain d'implantation (pièce n°3)",
      ],
      [
        { appelOffre: 'PPE2 - Sol', typeImport: 'démarches-simplifiées' },
        "Type de cas du terrain d'implantation",
      ],
    ],
    mapper: mapDétailsToTypeTerrainImplantation,
  },
  composantsRésilients: {
    labels: [
      [{ appelOffre: 'PPE2 - Sol', typeImport: 'démarches-simplifiées' }, 'Composants résilients'],
    ],
    mapper: noop,
  },
  noteInnovation: {
    labels: [
      [{ appelOffre: 'CRE4 - Innovation', typeImport: 'csv' }, 'Note innovation (AO innovation)'],
    ],
    mapper: getNumber,
  },
  noteDegréInnovationSur20: {
    labels: [
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        'Note degré d’innovation (/20pt) (AO innovation)',
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        'Note degré d’innovation (/20pt) (AO innovation)',
      ],
    ],
    mapper: getNumber,
  },
  noteInnovationAdéquationAmbitionsIndustriellesSur5: {
    labels: [
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        'Note adéquation du projet avec les ambitions industrielles (/5pt) (AO innovation)',
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        'Note adéquation du projet avec les ambitions industrielles (/5pt) (AO innovation)',
      ],
    ],
    mapper: getNumber,
  },
  noteInnovationAspectsEnvironnementauxEtSociauxSur5: {
    labels: [
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        'Note aspects environnementaux et sociaux (/5pt) (AO innovation)',
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        'Note aspects environnementaux et sociaux (/5pt) (AO innovation)',
      ],
    ],
    mapper: getNumber,
  },
  noteInnovationPositionnementSurLeMarchéSur10: {
    labels: [
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        'Note positionnement sur le marché (/10pt) (AO innovation)',
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        'Note positionnement sur le marché (/10pt) (AO innovation)',
      ],
    ],
    mapper: getNumber,
  },
  noteInnovationQualitéTechniqueSur5: {
    labels: [
      [
        { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
        'Note qualité technique (/5pt) (AO innovation)',
      ],
      [
        { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
        'Note qualité technique (/5pt) (AO innovation)',
      ],
    ],
    mapper: getNumber,
  },
  notePrix: {
    labels: [
      [{ appelOffre: 'CRE4 - Innovation', typeImport: 'csv' }, 'Note prix'],
      [{ appelOffre: 'PPE2 - Innovation', typeImport: 'csv' }, 'Note prix'],
    ],
    mapper: getNumber,
  },
};
