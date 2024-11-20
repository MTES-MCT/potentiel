import { Policy } from '..';

export const permissionCRE: Policy[] = [
  // Abandon
  'abandon.consulter.liste',
  'abandon.consulter.détail',

  // Recours
  'recours.consulter.liste',
  'recours.consulter.détail',

  // Achèvement
  'achèvement.consulter',

  // Raccordement
  'réseau.raccordement.consulter',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',

  // Candidature
  'candidature.attestation.télécharger',
];
