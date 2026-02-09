import { GraphQLClient } from 'graphql-request';

import { GetDossierQuery, getSdk } from './client.js';

export type * from './client.js';
export * from './accessor.js';
export type TypeChamp = GetDossierQuery['dossier']['champs'][number]['__typename'];

export const getDSApiClient = () => {
  const { DS_API_URL, DS_API_TOKEN } = process.env;
  if (!DS_API_URL) {
    throw new Error('DS_API_URL is required');
  }
  if (!DS_API_TOKEN) {
    throw new Error('DS_API_TOKEN is required');
  }
  const client = new GraphQLClient(DS_API_URL, {
    headers: {
      Authorization: `Bearer ${DS_API_TOKEN}`,
    },
  });
  return getSdk(client);
};
