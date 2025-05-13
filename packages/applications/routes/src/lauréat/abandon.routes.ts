import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Lauréat.Abandon.StatutAbandon.RawType;
};

export const lister = (filters: ListerFilters = {}) => {
  const searchParams = new URLSearchParams();

  if (filters?.statut) {
    searchParams.set('statut', filters.statut);
  }

  return `/abandons${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`;
