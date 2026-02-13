import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const ademePolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,
  'lauréat.listerLauréatEnrichi',
  'projet.accèsDonnées.prix',

  // Statistiques
  'statistiquesDGEC.consulter',

  // Éliminé
  'éliminé.listerÉliminéEnrichi',

  // Candidature
  'candidature.listerDétailsFournisseur',
];
