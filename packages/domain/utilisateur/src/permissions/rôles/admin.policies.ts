import { pageProjetPolicies } from '../common.js';
import { Policy } from '../policies.js';

export const adminPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,

  'projet.accèsDonnées.prix',

  // Historique
  'historique.imprimer',

  // Abandon
  'abandon.lister.demandes',
  'abandon.accorder',
  'abandon.rejeter',
  'abandon.demander-confirmation',
  'abandon.passer-en-instruction',

  // Recours
  'recours.consulter.liste',
  'recours.accorder',
  'recours.rejeter',
  'recours.passer-en-instruction',

  // Gestionnaire réseau
  'réseau.gestionnaire.lister',
  'réseau.gestionnaire.ajouter',
  'réseau.gestionnaire.modifier',

  // Raccordement
  'raccordement.gestionnaire.modifier',
  'raccordement.gestionnaire.modifier-après-mise-en-service',
  'raccordement.gestionnaire.modifier-après-achèvement',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.demande-complète-raccordement.modifier-après-mise-en-service',
  'raccordement.demande-complète-raccordement.modifier-après-achèvement',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
  'raccordement.proposition-technique-et-financière.modifier-après-achèvement',
  'raccordement.date-mise-en-service.transmettre',
  'raccordement.date-mise-en-service.modifier',
  'raccordement.date-mise-en-service.importer',
  'raccordement.référence-dossier.modifier',
  'raccordement.dossier.supprimer',
  'raccordement.dossier.supprimer-après-mise-en-service',
  'raccordement.dossier.supprimer-après-achèvement',
  'raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.archives.lister',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',

  // Attestation conformité
  'achèvement.modifier',

  // Candidature
  'candidature.consulter',
  'candidature.consulterDétail',
  'candidature.importer',
  'candidature.corriger',
  'candidature.lister',
  'candidature.attestation.prévisualiser',
  'candidature.listerDétailsFournisseur',

  // Période
  'période.lister',
  'période.consulter',

  // Représentant légal
  'représentantLégal.modifier',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.accorderChangement',
  'représentantLégal.rejeterChangement',

  // Actionnaire
  'actionnaire.modifier',
  'actionnaire.consulter',
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',
  'actionnaire.accorderChangement',
  'actionnaire.rejeterChangement',

  // Lauréat
  'lauréat.modifier',
  'lauréat.modifierSiteDeProduction',
  'lauréat.listerLauréatEnrichi',
  'nomProjet.modifier',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.remplacerAccèsProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.lister',
  'utilisateur.inviter',
  'utilisateur.inviterPorteur',
  'utilisateur.désactiver',
  'utilisateur.réactiver',
  'utilisateur.modifierRôle',

  // Puissance
  'puissance.modifier',
  'puissance.consulterChangement',
  'puissance.accorderChangement',
  'puissance.rejeterChangement',
  'puissance.listerChangement',

  // Producteur
  'producteur.listerChangement',
  'producteur.consulterChangement',
  'producteur.modifier',

  // Fournisseur
  'fournisseur.consulter',
  'fournisseur.modifierÉvaluationCarbone',
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.modifier',

  // Délai
  'délai.consulterDemande',
  'délai.listerDemandes',
  'délai.passerDemandeEnInstruction',
  'délai.reprendreInstructionDemande',
  'délai.rejeterDemande',
  'délai.accorderDemande',

  // installation
  'installation.installateur.modifier',
  'installation.typologieInstallation.modifier',
  'installation.dispositifDeStockage.modifier',
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.modifier',
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // Tâche
  'tâche.consulter',

  // Statistiques
  'statistiquesDGEC.consulter',

  // Éliminé
  'éliminé.listerÉliminéEnrichi',
];
