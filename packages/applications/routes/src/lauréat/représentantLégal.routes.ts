import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.RawType;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const changement = {
  détails: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/demander`,
  corriger: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}/corriger`,
  lister: (filters: ListerFilters = {}) => {
    const searchParams = new URLSearchParams();

    if (filters?.statut) {
      searchParams.set('statut', filters.statut);
    }

    return `/laureats/changements/representant-legal${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
