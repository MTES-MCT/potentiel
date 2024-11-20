import { Policy } from '..';

export const permissionAdmin: Policy[] = [
  // Abandon
  'abandon.consulter.liste',
  'abandon.consulter.détail',
  'abandon.accorder',
  'abandon.rejeter',
  'abandon.demander-confirmation',
  'abandon.annuler-rejet',

  // Recours
  'recours.consulter.liste',
  'recours.consulter.détail',
  'recours.accorder',
  'recours.rejeter',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',
  'réseau.gestionnaire.ajouter',
  'réseau.gestionnaire.modifier',

  // Raccordement
  'réseau.raccordement.consulter',
  'réseau.raccordement.gestionnaire.modifier',
  'réseau.raccordement.demande-complète-raccordement.transmettre',
  'réseau.raccordement.demande-complète-raccordement.modifier',
  'réseau.raccordement.proposition-technique-et-financière.transmettre',
  'réseau.raccordement.proposition-technique-et-financière.modifier',
  'réseau.raccordement.date-mise-en-service.transmettre',
  'réseau.raccordement.date-mise-en-service.modifier',
  'réseau.raccordement.date-mise-en-service.importer',
  'réseau.raccordement.référence-dossier.modifier',
  'réseau.raccordement.dossier.supprimer',
  'réseau.raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.archives.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.demander',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.actuelles.importer',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.effacerHistorique',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.lister',

  // Achèvement
  'achèvement.consulter',
  'achèvement.transmettre',
  'achèvement.modifier',

  // Candidature
  'candidature.importer',
  'candidature.corriger',
  'candidature.lister',
  'candidature.attestation.prévisualiser',
  'candidature.attestation.télécharger',

  // Période
  'période.lister',
  'période.consulter',
];

export const permissionDgecValidateur: Policy[] = [
  ...permissionAdmin,

  // Abandon
  'abandon.preuve-recandidature.accorder',

  // Période
  'période.notifier',
];
