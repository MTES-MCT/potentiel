import { get } from '@potentiel-libraries/http-client';

import { buildUrl } from './buildUrl';

type GeoApiDepartementItem = {
  nom: string;
};

export const fetchDepartements = (baseUrl: string) => async () =>
  get<GeoApiDepartementItem[]>({ url: buildUrl(baseUrl, 'departements') });
