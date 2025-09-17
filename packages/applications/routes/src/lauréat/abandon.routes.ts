import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

import { applyStatutFilter } from './_helpers/applyStatutFilter';

type ListerFilters = {
  statut?: Array<Lauréat.Abandon.StatutAbandon.RawType>;
};

export const lister = (filters: ListerFilters = {}) => {
  const searchParams = new URLSearchParams();

  applyStatutFilter<Lauréat.Abandon.StatutAbandon.RawType>(searchParams, filters.statut);

  return `/laureats/changements/abandon${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`;
