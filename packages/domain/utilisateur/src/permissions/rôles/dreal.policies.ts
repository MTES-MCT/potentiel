import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const drealPolicies: ReadonlyArray<Policy> = [
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

  // Raccordement
  'raccordement.listerDossierRaccordement',
  'raccordement.demande-complète-raccordement.transmettre',
  'raccordement.demande-complète-raccordement.modifier',
  'raccordement.proposition-technique-et-financière.transmettre',
  'raccordement.proposition-technique-et-financière.modifier',
  'raccordement.gestionnaire.modifier',

  // Garanties financières
  'garantiesFinancières.archives.lister',
  'garantiesFinancières.dépôt.lister',
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.modifier',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.enAttente.consulter',
  'garantiesFinancières.enAttente.lister',
  'garantiesFinancières.enAttente.générerModèleMiseEnDemeure',
  'garantiesFinancières.mainlevée.démarrerInstruction',
  'garantiesFinancières.mainlevée.accorder',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.mainlevée.rejeter',

  // Attestation conformité
  'achèvement.modifier',

  // Candidature
  'candidature.attestation.télécharger',
  'candidature.listerDétailsFournisseur',

  // Lauréat
  'lauréat.modifierSiteDeProduction',
  'nomProjet.modifier',
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',
  'lauréat.listerLauréatEnrichi',

  // Représentant légal
  'représentantLégal.modifier',
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',
  'représentantLégal.accorderChangement',
  'représentantLégal.rejeterChangement',

  // Actionnaire
  'actionnaire.modifier',
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',
  'actionnaire.accorderChangement',
  'actionnaire.rejeterChangement',

  // Puissance
  'puissance.modifier',
  'puissance.consulterChangement',
  'puissance.accorderChangement',
  'puissance.rejeterChangement',
  'puissance.listerChangement',

  // Accès
  'accès.autoriserAccèsProjet',
  'accès.retirerAccèsProjet',
  'accès.consulter',
  'accès.lister',
  'accès.listerProjetsÀRéclamer',

  // Utilisateur
  'utilisateur.inviterPorteur',

  // Producteur
  'producteur.modifier',
  'producteur.listerChangement',
  'producteur.consulterChangement',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // Fournisseur
  'fournisseur.listerChangement',
  'fournisseur.consulterChangement',
  'fournisseur.consulter',
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
