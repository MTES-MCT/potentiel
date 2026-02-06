import { fetchCommunes } from './fetchCommunes.js';

export const GeoApiClient = (baseUrl: string) => ({
  fetchCommunes: fetchCommunes(baseUrl),
});
