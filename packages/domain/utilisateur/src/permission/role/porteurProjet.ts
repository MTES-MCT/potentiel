import { Policy } from '..';

export const permissionPorteurProjet: Policy[] = [
  // Abandon
  'abandon.consulter.liste',
  'abandon.consulter.détail',
  'abandon.demander',
  'abandon.annuler',
  'abandon.confirmer',
  'abandon.preuve-recandidature.transmettre',

  // Recours
  'recours.consulter.liste',
  'recours.consulter.détail',
  'recours.demander',
  'recours.annuler',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.gestionnaire.modifier',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.référence-dossier.modifier',
  'réseau.raccordement.dossier.supprimer',

  // Tâche
  'tâche.consulter',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.supprimer',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.consulter',

  // Achèvement
  'achèvement.consulter',
  'achèvement.transmettre',

  // Candidature
  'candidature.attestation.télécharger',
];
