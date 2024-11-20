import { Policy } from '..';

export const permissionAcheteurObligé: Policy[] = [
  'réseau.raccordement.consulter',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',

  // Achèvement
  'achèvement.transmettre',

  // Candidature
  'candidature.attestation.télécharger',
];
