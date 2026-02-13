import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const cocontractantPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'projet.accèsDonnées.prix',

  // Abandon
  'abandon.lister.demandes',

  // Achèvement
  'achèvement.transmettreDate',
  'achèvement.listerProjetAvecAchevementATransmettre',

  // Actionnaire
  'actionnaire.consulterChangement',
  'actionnaire.listerChangement',

  // Représentant Légal
  'représentantLégal.consulterChangement',
  'représentantLégal.listerChangement',

  // Puissance
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

  // Raccordement
  'raccordement.listerDossierRaccordement',
];
