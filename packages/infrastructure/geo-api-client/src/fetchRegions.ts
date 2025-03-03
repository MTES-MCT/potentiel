import { get } from '@potentiel-libraries/http-client';

import { buildUrl } from './buildUrl';

type GeoApiRegionItem = {
  nom: string;
};

export const fetchRegions = (baseUrl: string) => async () =>
  get<GeoApiRegionItem[]>({ url: buildUrl(baseUrl, 'regions') });
