import { AsyncLocalStorage } from 'async_hooks';

import { type PotentielUtilisateur } from './types';

export type RequestContext = {
  correlationId: string;
  app?: 'web' | 'legacy' | 'subscribers' | 'cli' | 'api';
  features: Array<string>;
  utilisateur?: PotentielUtilisateur;
  url?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
