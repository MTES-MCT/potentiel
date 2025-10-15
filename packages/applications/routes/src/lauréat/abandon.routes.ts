import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';
import { withFilters } from '../_helpers/withFilters';

type ListerFilters = {
  statut?: Array<Lauréat.Abandon.StatutAbandon.RawType>;
  autorite?: Lauréat.Abandon.AutoritéCompétente.RawType;
};

export const lister = withFilters<ListerFilters>(`/laureats/changements/abandon`);

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`;
