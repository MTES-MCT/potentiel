import { Policy } from '..';

export const permissionCaisseDesDépôts: Policy[] = [
  // Garanties financières
  'garantiesFinancières.actuelles.consulter',
  'garantiesFinancières.dépôt.consulter',
  'garantiesFinancières.mainlevée.lister',

  // Achèvement
  'achèvement.consulter',
];
