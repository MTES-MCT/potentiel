import { Where } from '@potentiel-domain/entity';

import { TypeActionnariat } from '../candidature/index.js';

export const getTypeActionnariatWhereConditions = (
  typeActionnariat?: Array<TypeActionnariat.RawType>,
) => {
  if (!typeActionnariat?.length) {
    return undefined;
  }
  if (
    typeActionnariat.includes('financement-collectif') ||
    typeActionnariat.includes('gouvernance-partagée')
  ) {
    typeActionnariat.push('financement-collectif-et-gouvernance-partagée');
  }
  return Where.matchAny(typeActionnariat);
};
