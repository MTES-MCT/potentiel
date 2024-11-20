import { Policy } from '..';

export const permissionDreal: Policy[] = [
  // Abandon
  'abandon.consulter.liste',
  'abandon.consulter.détail',

  // Recours
  'recours.consulter.liste',
  'recours.consulter.détail',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.gestionnaire.modifier',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.archives.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.rejeter',

  // Achèvement
  'achèvement.consulter',
  'achèvement.transmettre',
  'achèvement.modifier',

  // Candidature
  'candidature.attestation.télécharger',
];
