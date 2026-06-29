import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';
import { getTechnologieEolien } from './getTechnologieEolien.js';
import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const mapToBoolean = (value: string | undefined): boolean | undefined => {
  if (!value) return undefined;
  const v = value.toLowerCase();

  if (v === 'oui' || v === 'true') return true;
  if (v === 'non' || v === 'false') return false;
};

const mapToNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  const number = Number(value.replace(',', '.'));
  return Number.isNaN(number) ? undefined : number;
};

const mapToString = (value: string | undefined) => value;

export const templateVérificationDétailCandidature: Template<Candidature.DétailsCandidature> = {
  pv: {
    typeTerrainImplantation: {
      label: [
        [{ appelOffre: 'Fessenheim' }, "Type de terrain d'implantation (pièce n°3)"],
        [{ appelOffre: 'CRE4 - ZNI 2017' }, "Type de terrain d'implantation (pièce n°3)"],
        [{ appelOffre: 'CRE4 - ZNI' }, "Type de terrain d'implantation (pièce n°3)"],
        [{ appelOffre: 'CRE4 - Innovation' }, "Type de terrain d'implantation (pièce n°3)"],
        [{ appelOffre: 'CRE4 - Sol' }, "Type de terrain d'implantation (pièce n°3)"],
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
          { appelOffre: 'PPE2 - Autoconsommation métropole', typeImport: 'csv' },
          "Type de terrain d'implantation (pièce n°3)",
        ],
        [
          { appelOffre: 'PPE2 - ZNI', typeImport: 'csv' },
          "Type de terrain d'implantation (pièce n°3)",
        ],
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarche-numérique' },
          "Type de cas du terrain d'implantation",
        ],
      ],
      mapper: mapDétailsToTypeTerrainImplantation,
    },
    natureExacteDuTerrain: {
      label: [
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarche-numérique' },
          'Nature exacte du terrain',
        ],
      ],
      mapper: mapToString,
    },
    dateObtentionCETI: {
      label: [
        [{ appelOffre: 'PPE2 - Sol' }, "Date d'obtention du CETI"],
        [{ appelOffre: 'PPE2 - Innovation' }, "Date d'obtention du CETI"],
        [{ appelOffre: 'PPE2 - Neutre' }, "Date d'obtention du CETI"],
        [{ appelOffre: 'PPE2 - Autoconsommation métropole' }, "Date d'obtention du CETI"],
        [{ appelOffre: 'PPE2 - ZNI' }, "Date d'obtention du CETI"],
      ],
      mapper: mapToString,
    },
    surfaceProjetéeAuSol: {
      label: [
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarche-numérique' },
          "Surface projetée au sol de l'ensemble des capteurs solaires",
        ],
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Bâtiment', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - ZNI', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Autoconsommation métropole', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'PPE2 - ZNI', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'CRE4 - ZNI 2017', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'CRE4 - ZNI', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'Fessenheim', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'CRE4 - Sol', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
        [
          { appelOffre: 'CRE4 - Bâtiment', typeImport: 'csv' },
          'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
        ],
      ],
      mapper: mapToString,
    },
    surfaceTotaleTerrainImplantation: {
      label: [
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarche-numérique' },
          "Surface totale du terrain d'implantation",
        ],
        [{ appelOffre: 'PPE2 - Sol', typeImport: 'csv' }, 'Surface du Terrain d’implantation (ha)'],
        [
          { appelOffre: 'PPE2 - Bâtiment', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
        [
          { appelOffre: 'PPE2 - Autoconsommation métropole', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
        [{ appelOffre: 'PPE2 - ZNI', typeImport: 'csv' }, 'Surface du Terrain d’implantation (ha)'],
        [
          { appelOffre: 'CRE4 - ZNI 2017', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
        [{ appelOffre: 'CRE4 - ZNI', typeImport: 'csv' }, 'Surface du Terrain d’implantation (ha)'],
        [{ appelOffre: 'Fessenheim', typeImport: 'csv' }, 'Surface du Terrain d’implantation (ha)'],
        [{ appelOffre: 'CRE4 - Sol', typeImport: 'csv' }, 'Surface du Terrain d’implantation (ha)'],
        [
          { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
          'Surface du Terrain d’implantation (ha)',
        ],
      ],
      mapper: mapToString,
    },
    composantsRésilients: {
      label: [
        [{ appelOffre: 'PPE2 - Sol', typeImport: 'démarche-numérique' }, 'Composants résilients'],
      ],
      mapper: mapToString,
    },
  },
  éolien: {
    technologie: {
      label: [
        [{ appelOffre: 'Eolien' }, 'Technologie (Modules ou films)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Technologie (AO éolien)'],
        [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Technologie (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' }, 'Technologie'],
      ],
      mapper: getTechnologieEolien,
    },
    diamètreRotorEnMètres: {
      label: [
        [{ appelOffre: 'Eolien' }, 'Diamètre du rotor (m) (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
        [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' }, 'Diamètre du rotor'],
      ],
      mapper: mapToNumber,
    },
    hauteurBoutDePâleEnMètres: {
      label: [
        [{ appelOffre: 'Eolien' }, 'Hauteur bout de pâle (m) (AO éolien)'],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Hauteur bout de pâle (m) (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
          'Hauteur bout de pâle (m) (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' },
          'Hauteur en bout de pale',
        ],
      ],
      mapper: mapToNumber,
    },
    nombreDAérogénérateurs: {
      label: [
        [{ appelOffre: 'Eolien' }, "Nb d'aérogénérateurs (AO éolien)"],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
        [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' },
          "Nombre d'aérogénérateurs",
        ],
      ],
      mapper: mapToNumber,
    },
    puissanceUnitaireDesAérogénérateurs: {
      label: [
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Puissance unitaire des aérogénérateurs (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
          'Puissance unitaire des aérogénérateurs (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' },
          'Puissance unitaire des aérogénérateurs',
        ],
      ],
      mapper: mapToNumber,
    },
    installationRenouvelée: {
      label: [
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Installation renouvellée (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Neutre', typeImport: 'csv' },
          'Installation renouvellée (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-numérique' },
          "L'installation est-elle renouvelée ?",
        ],
      ],
      mapper: mapToBoolean,
    },
  },
  innovation: {
    note: {
      label: [[{ appelOffre: 'CRE4 - Innovation' }, 'Note innovation (AO innovation)']],
      mapper: mapToNumber,
    },
    noteDegréInnovationSur20: {
      label: [
        [{ appelOffre: 'CRE4 - Innovation' }, 'Note degré d’innovation (/20pt) (AO innovation)'],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Note degré d’innovation (/20pt) (AO innovation)',
        ],
      ],
      mapper: mapToNumber,
    },
    noteAdéquationAmbitionsIndustriellesSur5: {
      label: [
        [
          { appelOffre: 'CRE4 - Innovation' },
          'Note adéquation du projet avec les ambitions industrielles (/5pt) (AO innovation)',
        ],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Note adéquation du projet avec les ambitions industrielles (/5pt) (AO innovation)',
        ],
      ],
      mapper: mapToNumber,
    },
    noteAspectsEnvironnementauxEtSociauxSur5: {
      label: [
        [
          { appelOffre: 'CRE4 - Innovation' },
          'Note aspects environnementaux et sociaux (/5pt) (AO innovation)',
        ],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Note aspects environnementaux et sociaux (/5pt) (AO innovation)',
        ],
      ],
      mapper: mapToNumber,
    },
    notePositionnementSurLeMarchéSur10: {
      label: [
        [
          { appelOffre: 'CRE4 - Innovation' },
          'Note positionnement sur le marché (/10pt) (AO innovation)',
        ],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Note positionnement sur le marché (/10pt) (AO innovation)',
        ],
      ],
      mapper: mapToNumber,
    },
    noteQualitéTechniqueSur5: {
      label: [
        [{ appelOffre: 'CRE4 - Innovation' }, 'Note qualité technique (/5pt) (AO innovation)'],
        [
          { appelOffre: 'PPE2 - Innovation', typeImport: 'csv' },
          'Note qualité technique (/5pt) (AO innovation)',
        ],
      ],
      mapper: mapToNumber,
    },
  },
  notePrix: {
    label: [
      [{ appelOffre: 'CRE4 - Innovation' }, 'Note prix'],
      [{ appelOffre: 'PPE2 - Innovation', typeImport: 'csv' }, 'Note prix'],
    ],
    mapper: mapToNumber,
  },
};
