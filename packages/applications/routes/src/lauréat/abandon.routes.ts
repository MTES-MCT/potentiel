import type { Lauréat } from '@potentiel-domain/projet';

import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

type ListerFilters = {
  statut?: Array<Lauréat.Abandon.StatutAbandon.RawType>;
  autorite?: Lauréat.Abandon.AutoritéCompétente.RawType;
};

export const lister = withFilters<ListerFilters>(`/laureats/changements/abandon`);

export const détail = (identifiantProjet: string, demandéLe: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/${demandéLe}`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`;

export const détailRedirection = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon`;
