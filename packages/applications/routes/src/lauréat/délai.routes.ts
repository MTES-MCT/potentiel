import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

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

export const téléchargerModèleRéponse = ({
  date,
  identifiantProjet,
  motif,
}: {
  identifiantProjet: string;
  date: DateTime.RawType;
  motif: Lauréat.Délai.MotifDemandeDélai.RawType;
}) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/modele-reponse?motif=${motif === 'prolongation-phase-essai' ? 'prolongation-phase-essai' : 'prolongation-delai-achevement'}`;
