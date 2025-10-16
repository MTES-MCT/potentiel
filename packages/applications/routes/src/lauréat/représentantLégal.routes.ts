import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';
import { withFilters } from '../_helpers/withFilters';

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
  lister: withFilters<ListerFilters>(`/laureats/changements/representant-legal`),
};
