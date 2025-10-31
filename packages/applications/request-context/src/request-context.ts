import { AsyncLocalStorage } from 'async_hooks';

import { UtilisateurPotentiel } from './types';

export type RequestContext = {
  correlationId: string;
  app?: 'web' | 'legacy' | 'subscribers' | 'cli';
  features: Array<string>;
  utilisateur?: UtilisateurPotentiel & { accountUrl: string };
  url?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
