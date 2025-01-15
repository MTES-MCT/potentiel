import type { Recours } from '@potentiel-domain/elimine';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Recours.StatutRecours.RawType;
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

  return `/recours${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const détail = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours`;

export const demander = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/modele-reponse`;
