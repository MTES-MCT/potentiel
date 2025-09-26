import { AsyncLocalStorage } from 'async_hooks';

import { type Utilisateur } from '@potentiel-domain/utilisateur';

export type RequestContext = {
  correlationId: string;
  features: Array<string>;
  utilisateur?: Utilisateur.ValueType & { accountUrl: string };
  url?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
