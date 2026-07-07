import { GraphQLClient } from 'graphql-request';

import { type GetDossierQuery, getSdk } from './client.js';

export * from './accessor.js';
export type * from './client.js';
export type TypeChamp = GetDossierQuery['dossier']['champs'][number]['__typename'];

export const getDémarcheNumériqueApiClient = () => {
  const { DEMARCHE_NUMERIQUE_API_URL, DEMARCHE_NUMERIQUE_API_TOKEN } = process.env;
  if (!DEMARCHE_NUMERIQUE_API_URL) {
    throw new Error('DEMARCHE_NUMERIQUE_API_URL is required');
  }
  if (!DEMARCHE_NUMERIQUE_API_TOKEN) {
    throw new Error('DEMARCHE_NUMERIQUE_API_TOKEN is required');
  }
  const client = new GraphQLClient(DEMARCHE_NUMERIQUE_API_URL, {
    headers: {
      Authorization: `Bearer ${DEMARCHE_NUMERIQUE_API_TOKEN}`,
    },
  });
  return getSdk(client);
};
