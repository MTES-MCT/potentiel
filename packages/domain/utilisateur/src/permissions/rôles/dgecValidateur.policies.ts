import { Policy } from '../policies.js';

import { adminPolicies } from './admin.policies.js';

export const dgecValidateurPolicies: ReadonlyArray<Policy> = [
  ...adminPolicies,

  // Abandon
  'abandon.preuve-recandidature.accorder',

  // Période
  'période.notifier',
];
