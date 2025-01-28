import { Actionnaire } from '@potentiel-domain/laureat';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Actionnaire.StatutChangementActionnaire.RawType;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/modifier`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/demander`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/enregistrer`,
  détails: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/${demandéLe}`,
  téléchargerModèleRéponse: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/modele-reponse`,

  lister: (filters: ListerFilters = {}) => {
    const searchParams = new URLSearchParams();

    if (filters?.statut) {
      searchParams.set('statut', filters.statut);
    }

    return `/laureats/changements/actionnaire${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
