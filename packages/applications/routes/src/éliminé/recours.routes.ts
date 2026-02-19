import type { Éliminé } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { encodeParameter } from '../encodeParameter.js';
import { withFilters } from '../_helpers/withFilters.js';

type ListerFilters = {
  statut?: Array<Éliminé.Recours.StatutRecours.RawType>;
};

export const lister = withFilters<ListerFilters>(`/recours`);

export const détail = (identifiantProjet: string, demandéLe: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours/${demandéLe}`;

export const détailPourRedirection = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours`;

export const demander = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string, date: DateTime.RawType) =>
  `/elimines/${encodeParameter(identifiantProjet)}/recours/${date}/modele-reponse`;
