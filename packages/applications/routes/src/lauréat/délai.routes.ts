import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Array<Lauréat.Délai.StatutDemandeDélai.RawType>;
};

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const corriger = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/corriger`;

export const lister = (filters: ListerFilters) => {
  const searchParams = new URLSearchParams();

  if (filters?.statut?.length) {
    filters.statut.forEach((s) => {
      searchParams.append('statut', s);
    });
  }

  return `/laureats/changements/delai${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const téléchargerModèleRéponse = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/modele-reponse`;
