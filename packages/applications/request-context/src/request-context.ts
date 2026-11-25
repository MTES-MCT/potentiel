import { AsyncLocalStorage } from 'node:async_hooks';

import type { Utilisateur } from '@potentiel-domain/utilisateur';

export type RequestContext = {
  correlationId: string;
  app?: 'web' | 'subscribers' | 'cli' | 'api';
  utilisateur?: Utilisateur.ValueType;
  url?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
