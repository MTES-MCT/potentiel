import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const crePolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'lauréat.listerLauréatEnrichi',

  'projet.accèsDonnées.prix',

  // Abandon
  'abandon.lister.demandes',

  // Recours
  'recours.consulter.liste',

  // Raccordement
  'raccordement.listerDossierRaccordement',

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.consulter',

  // Actionnaire
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',

  // Représentant Légal
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',

  // Puissance
  'puissance.consulterChangement',
  'puissance.listerChangement',

  // Producteur
  'producteur.consulterChangement',
  'producteur.listerChangement',

  // Fournisseur
  'fournisseur.consulterChangement',
  'fournisseur.listerChangement',

  // Délai
  'délai.consulterDemande',
  'délai.listerDemandes',

  // Nature de l'exploitation
  'natureDeLExploitation.listerChangement',
  'natureDeLExploitation.consulterChangement',

  // installation
  'installation.installateur.consulterChangement',
  'installation.installateur.listerChangement',
  'installation.dispositifDeStockage.consulterChangement',
  'installation.dispositifDeStockage.listerChangement',

  // Nom Projet
  'nomProjet.consulterChangement',
  'nomProjet.listerChangement',

  // Accès
  'accès.consulter',

  //  Candidature
  'candidature.consulterDétail',
  'candidature.consulter',

  // Statistiques
  'statistiquesDGEC.consulter',

  // Éliminé
  'éliminé.listerÉliminéEnrichi',

  // Candidature
  'candidature.listerDétailsFournisseur',
];
