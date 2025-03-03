import { fetchCommunes } from './fetchCommunes';
import { fetchDepartements } from './fetchDepartements';

export const GeoApiClient = (baseUrl: string) => ({
  fetchCommunes: fetchCommunes(baseUrl),
  fetchDepartements: fetchDepartements(baseUrl),
});
