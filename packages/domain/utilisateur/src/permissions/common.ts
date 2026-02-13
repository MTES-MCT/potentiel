import { Policy } from './policies.js';

export const commonPolicies: ReadonlyArray<Policy> = [
  'historique.lister',

  'appelOffre.consulter',
  'cahierDesCharges.consulter',

  // Header projet
  'lauréat.consulter',
  'éliminé.consulter',
  'abandon.consulter.enCours',

  'lauréat.lister',
  'éliminé.lister',
];

// En attendant d'avoir des gateways qui groupent les query
export const pageProjetPolicies: Policy[] = [
  ...commonPolicies,
  // Abandon
  'abandon.consulter.demande',

  // Recours
  'recours.consulter.détail',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.consulter',

  // Puissance
  'puissance.consulter',

  // Producteur
  'producteur.consulter',

  // Fournisseur
  'fournisseur.consulter',

  // Installation
  'installation.consulter',

  // Nature de l'exploitation
  'natureDeLExploitation.consulter',

  // Achèvement
  'achèvement.consulter',

  // Raccordement
  'raccordement.consulter',
];
