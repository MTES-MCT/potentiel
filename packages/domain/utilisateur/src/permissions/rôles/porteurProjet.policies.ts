import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const porteurProjetPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'lauréat.listerLauréatEnrichi',
  'projet.accèsDonnées.prix',

  // Historique
  'historique.imprimer',

  // Abandon
  'abandon.lister.demandes',
  'abandon.demander',
  'abandon.annuler',
  'abandon.confirmer',
  'abandon.preuve-recandidature.transmettre',

  // Recours
  'recours.consulter.liste',
  'recours.demander',
  'recours.annuler',

  // Raccordement
  'raccordement.gestionnaire.modifier',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.référence-dossier.modifier',
  'raccordement.dossier.supprimer',

  // Tâche
  'tâche.consulter',

  // Garanties financières
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.supprimer',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.annuler',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.consulter',

  // Attestation conformité
  'achèvement.transmettreAttestation',

  // Candidature
  'candidature.attestation.télécharger',

  // Représentant légal
  'représentantLégal.demanderChangement',
  'représentantLégal.annulerChangement',
  'représentantLégal.corrigerChangement',
  'représentantLégal.consulterChangement',
  'représentantLégal.enregistrerChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.consulter',

  // Actionnaire
  'actionnaire.consulter',
  'actionnaire.consulterChangement',
  'actionnaire.enregistrerChangement',
  'actionnaire.demanderChangement',
  'actionnaire.annulerChangement',
  'actionnaire.listerChangement',

  // Puissance
  'puissance.consulter',
  'puissance.consulterChangement',
  'puissance.enregistrerChangement',
  'puissance.demanderChangement',
  'puissance.annulerChangement',
  'puissance.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.réclamerProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.inviterPorteur',

  // Cahier des charges
  'cahierDesCharges.choisir',

  // Producteur
  'producteur.listerChangement',
  'producteur.enregistrerChangement',
  'producteur.consulterChangement',
  'producteur.consulter',

  // Fournisseur
  'fournisseur.enregistrerChangement',
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.consulter',

  // Délai
  'délai.consulterDemande',
  'délai.listerDemandes',
  'délai.demander',
  'délai.annulerDemande',
  'délai.corrigerDemande',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.enregistrerChangement',
  'natureDeLExploitation.consulterChangement',
  'natureDeLExploitation.consulter',

  // installation
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.installateur.enregistrerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',
  'installation.dispositifDeStockage.enregistrerChangement',

  // Nom Projet
  'nomProjet.enregistrerChangement',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',

  // Éliminé
  'éliminé.listerÉliminéEnrichi',
];
