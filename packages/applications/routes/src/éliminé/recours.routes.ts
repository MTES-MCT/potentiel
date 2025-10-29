import type { Éliminé } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';
import { withFilters } from '../_helpers/withFilters';

type ListerFilters = {
  statut?: Array<Éliminé.Recours.StatutRecours.RawType>;
};

export const lister = withFilters<ListerFilters>(`/recours`);

export const détail = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours`;

export const demander = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours/modele-reponse`;
