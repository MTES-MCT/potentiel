import type { Éliminé } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Array<Éliminé.Recours.StatutRecours.RawType>;
};

export const lister = (filters: ListerFilters = {}) => {
  const searchParams = new URLSearchParams();

  if (filters?.statut?.length) {
    filters.statut.forEach((s) => {
      searchParams.append('statut', s);
    });
  }

  return `/recours${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détail = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours`;

export const demander = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/modele-reponse`;
