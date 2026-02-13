import { Policy } from '../policies.js';
import { pageProjetPolicies } from '../common.js';

export const caisseDesDépôtsPolicies: ReadonlyArray<Policy> = [
  // Projet
  ...pageProjetPolicies,

  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.enAttente.consulter',
];
