import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Array<Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.RawType>;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const changement = {
  détails: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/demander`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/enregistrer`,
  corriger: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}/corriger`,
  lister: (filters: ListerFilters) => {
    const searchParams = new URLSearchParams();

    if (filters?.statut?.length) {
      filters.statut.forEach((s) => {
        searchParams.append('statut', s);
      });
    }

    return `/laureats/changements/representant-legal${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
