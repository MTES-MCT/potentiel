import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

type ListerFilters = {
  statut?: Array<Lauréat.Délai.StatutDemandeDélai.RawType>;
  autoriteCompetente?: Lauréat.Délai.AutoritéCompétente.RawType;
};

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const détailsPourRedirection = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai`;

export const corriger = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/corriger`;

export const lister = withFilters<ListerFilters>(`/laureats/changements/delai`);

export const téléchargerModèleRéponse = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/modele-reponse`;
