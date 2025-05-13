import { fetchCommunes } from './fetchCommunes';

export const GeoApiClient = (baseUrl: string) => ({
  fetchCommunes: fetchCommunes(baseUrl),
});
