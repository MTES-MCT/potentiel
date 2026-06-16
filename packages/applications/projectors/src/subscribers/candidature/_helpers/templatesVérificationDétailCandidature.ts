import type { Candidature } from '@potentiel-domain/projet';

import type { Template } from './applyTemplateToPayload.js';
import { mapDétailsToTypeTerrainImplantation } from './mapDétailsToTypeTerrainImplantation.js';

const getTechnologieEolien = (
  value?: string,
): Candidature.DétailCandidatureVérifié['technologieAoÉolien'] => {
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

const noop = <T>(value: T) => value;

export const templateVérificationDétailCandidature: Template<Candidature.DétailCandidatureVérifié> =
  {
    technologieAoÉolien: {
      labels: [
        [{ appelOffre: 'Eolien' }, 'Technologie (Modules ou films)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Technologie (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' }, 'Technologie'],
      ],
      mapper: getTechnologieEolien,
    },
    diamètreRotorEnMètres: {
      labels: [
        [{ appelOffre: 'Eolien' }, 'Diamètre du rotor (m) (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, 'Diamètre du rotor (m) (AO éolien)'],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' }, 'Diamètre du rotor'],
      ],
      mapper: noop,
    },
    hauteurBoutDePâleEnMètres: {
      labels: [
        [{ appelOffre: 'Eolien' }, 'Hauteur bout de pâle (m) (AO éolien)'],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Hauteur bout de pâle (m) (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
          'Hauteur en bout de pale',
        ],
      ],
      mapper: noop,
    },
    nombreDAérogénérateurs: {
      labels: [
        [{ appelOffre: 'Eolien' }, "Nb d'aérogénérateurs (AO éolien)"],
        [{ appelOffre: 'PPE2 - Eolien', typeImport: 'csv' }, "Nb d'aérogénérateurs (AO éolien)"],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
          "Nombre d'aérogénérateurs",
        ],
      ],
      mapper: noop,
    },
    puissanceUnitaireDesAérogénérateurs: {
      labels: [
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Puissance unitaire des aérogénérateurs (AO éolien)',
        ],
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'démarches-simplifiées' },
          'Puissance unitaire des aérogénérateurs',
        ],
      ],
      mapper: noop,
    },
    installationRenouvelée: {
      labels: [
        [
          { appelOffre: 'PPE2 - Eolien', typeImport: 'csv' },
          'Installation renouvellée (AO éolien)',
        ],
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
          { appelOffre: 'CRE4 - Autoconsommation ZNI', typeImport: 'csv' },
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
        [
          { appelOffre: 'PPE2 - Sol', typeImport: 'démarches-simplifiées' },
          'Composants résilients',
        ],
      ],
      mapper: noop,
    },
  };
