import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

import { applyStatutFilter } from './_helpers/applyStatutFilter';

type ListerFilters = {
  statut?: Array<Lauréat.Délai.StatutDemandeDélai.RawType>;
  autoriteCompetente?: Lauréat.Délai.AutoritéCompétente.RawType;
};

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const corriger = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/corriger`;

export const lister = (filters: ListerFilters) => {
  const searchParams = new URLSearchParams();

  applyStatutFilter<Lauréat.Délai.StatutDemandeDélai.RawType>(searchParams, filters.statut);

  if (filters?.autoriteCompetente) {
    searchParams.set('autoriteCompetente', filters.autoriteCompetente);
  }

  return `/laureats/changements/delai${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const téléchargerModèleRéponse = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/modele-reponse`;
