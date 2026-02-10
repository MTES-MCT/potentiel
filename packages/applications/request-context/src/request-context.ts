import { AsyncLocalStorage } from 'async_hooks';

import { Utilisateur } from '@potentiel-domain/utilisateur';

export type PotentielUtilisateur = Utilisateur.ValueType & {
  nom?: string;
  accountUrl?: string;
};

export type RequestContext = {
  correlationId: string;
  app?: 'web' | 'subscribers' | 'cli' | 'api';
  features: Array<string>;
  utilisateur?: PotentielUtilisateur;
  url?: string;
};

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
export const getContext = () => requestContextStorage.getStore();
