import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

import { applyStatutFilter } from './_helpers/applyStatutFilter';

type ListerFilters = {
  statut?: Array<Lauréat.Actionnaire.StatutChangementActionnaire.RawType>;
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
  téléchargerModèleRéponseAccordé: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/modele-reponse?estAccordé=true`,
  téléchargerModèleRéponseRejeté: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/modele-reponse?estAccordé=false`,
  lister: (filters: ListerFilters) => {
    const searchParams = new URLSearchParams();

    applyStatutFilter<Lauréat.Actionnaire.StatutChangementActionnaire.RawType>(
      searchParams,
      filters.statut ?? [],
    );

    return `/laureats/changements/actionnaire${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
