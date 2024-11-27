import { AsyncLocalStorage } from 'async_hooks';

import { type Utilisateur } from '@potentiel-domain/utilisateur';

export type RequestContext = {
  correlationId: string;
  utilisateur?: Utilisateur.ValueType;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
