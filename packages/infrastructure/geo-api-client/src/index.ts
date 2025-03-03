import { fetchCommunes } from './fetchCommunes';
import { fetchDepartements } from './fetchDepartements';
import { fetchRegions } from './fetchRegions';

export const GeoApiClient = (baseUrl: string) => ({
  fetchCommunes: fetchCommunes(baseUrl),
  fetchDepartements: fetchDepartements(baseUrl),
  fetchRegions: fetchRegions(baseUrl),
});
