import { get } from '@potentiel-libraries/http-client';

import { buildUrl } from './buildUrl.js';

type GeoApiCommuneItem = {
  nom: string;
  codesPostaux: string[];
  departement: {
    code: string;
    nom: string;
  };
  region: {
    code: string;
    nom: string;
  };
};

export const fetchCommunes = (baseUrl: string) => async (search: string) =>
  get<GeoApiCommuneItem[]>({
    url: buildUrl(baseUrl, 'communes', {
      nom: search,
      fields: 'departement,region,codesPostaux',
      boost: 'population',
      limit: '10',
    }),
  });
