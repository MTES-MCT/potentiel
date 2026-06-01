import { HistoriqueProjector } from '@potentiel-applications/projectors';

import type { SubscriberSetup } from './createSubscriptionSetup.js';

export const setupHistorique = (): SubscriberSetup => {
  HistoriqueProjector.register();
  return {
    setupSubscriptions: async () => {},
    clearSubscriptions: async () => {},
    listSubscriptions: () => [],
  };
};
