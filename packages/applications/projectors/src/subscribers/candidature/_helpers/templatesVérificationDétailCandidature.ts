import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';
import { getTechnologieEolien } from './getTechnologieEolien.js';
import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const getBoolean = (value: string | undefined): boolean | undefined => {
  if (!value) return undefined;
  const v = value.toLowerCase();

  if (v === 'oui' || v === 'true') return true;
  if (v === 'non' || v === 'false') return false;
};

const getNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  const number = Number(value.replace(',', '.'));
  return Number.isNaN(number) ? undefined : number;
};

const noop = <T>(value: T) => value;

export const templateVérificationDétailCandidature: Template<Candidature.DétailsCandidature> = {
  pv: {
    type: 'group',
    fields: {
      typeTerrainImplantation: {
        type: 'field',
        label: [
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
            { appelOffre: 'PPE2 - Autoconsommation métropole', typeImport: 'csv' },
            "Type de terrain d'implantation (pièce n°3)",
          ],
          [
            { appelOffre: 'PPE2 - ZNI', typeImport: 'csv' },
            "Type de terrain d'implantation (pièce n°3)",
          ],
          [
            { appelOffre: 'PPE2 - Sol', typeImport: 'démarche-simplifiée' },
            "Type de cas du terrain d'implantation",
          ],
        ],
        mapper: mapDétailsToTypeTerrainImplantation,
      },
    },
  },
  éolien: {
    type: 'group',
    fields: {
      technologie: {
        type: 'field',
        label: [
          [{ appelOffre: 'Eolien' }, 'Technologie (Modules ou films)'],
          [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Technologie (AO éolien)'],
          [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Technologie (AO éolien)'],
          [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' }, 'Technologie'],
        ],
        mapper: getTechnologieEolien,
      },
      diamètreRotorEnMètres: {
        type: 'field',

        label: [
          [{ appelOffre: 'Eolien' }, 'Diamètre du rotor (m) (AO éolien)'],
          [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
          [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
          [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' }, 'Diamètre du rotor'],
        ],
        mapper: getNumber,
      },
      hauteurBoutDePâleEnMètres: {
        type: 'field',
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
            { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' },
            'Hauteur en bout de pale',
          ],
        ],
        mapper: getNumber,
      },
      nombreDAérogénérateurs: {
        type: 'field',
        label: [
          [{ appelOffre: 'Eolien' }, "Nb d'aérogénérateurs (AO éolien)"],
          [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
          [{ appelOffre: 'PPE2 - Neutre', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
          [
            { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' },
            "Nombre d'aérogénérateurs",
          ],
        ],
        mapper: getNumber,
      },
      puissanceUnitaireDesAérogénérateurs: {
        type: 'field',
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
            { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' },
            'Puissance unitaire des aérogénérateurs',
          ],
        ],
        mapper: getNumber,
      },
      installationRenouvelée: {
        type: 'field',
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
            { appelOffre: 'PPE2 - Eolien', typeImport: 'démarche-simplifiée' },
            "L'installation est-elle renouvelée ?",
          ],
        ],
        mapper: getBoolean,
      },
    },
  },
  composantsRésilients: {
    type: 'field',
    label: [
      [{ appelOffre: 'PPE2 - Sol', typeImport: 'démarche-simplifiée' }, 'Composants résilients'],
    ],
    mapper: noop,
  },
  innovation: {
    type: 'group',
    fields: {
      note: {
        type: 'field',
        label: [
          [
            { appelOffre: 'CRE4 - Innovation', typeImport: 'csv' },
            'Note innovation (AO innovation)',
          ],
        ],
        mapper: getNumber,
      },
      noteDegréInnovationSur20: {
        type: 'field',
        label: [
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
      noteAdéquationAmbitionsIndustriellesSur5: {
        type: 'field',
        label: [
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
      noteAspectsEnvironnementauxEtSociauxSur5: {
        type: 'field',
        label: [
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
      notePositionnementSurLeMarchéSur10: {
        type: 'field',
        label: [
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
      noteQualitéTechniqueSur5: {
        type: 'field',
        label: [
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
    },
  },
  notePrix: {
    type: 'field',
    label: [
      [{ appelOffre: 'CRE4 - Innovation', typeImport: 'csv' }, 'Note prix'],
      [{ appelOffre: 'PPE2 - Innovation', typeImport: 'csv' }, 'Note prix'],
    ],
    mapper: getNumber,
  },
};
