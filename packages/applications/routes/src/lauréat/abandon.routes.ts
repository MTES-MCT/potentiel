import { Abandon } from '@potentiel-domain/laureat';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Abandon.StatutAbandon.RawType;
  appelOffre?: string;
};

export const lister = (filters: ListerFilters = {}) => {
  const searchParams = new URLSearchParams();

  if (filters?.appelOffre) {
    searchParams.set('appelOffre', filters.appelOffre);
  }

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
