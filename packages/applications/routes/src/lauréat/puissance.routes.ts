import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

import { applyStatutFilter } from './_helpers/applyStatutFilter';

type ListerFilters = {
  statut?: Array<Lauréat.Puissance.StatutChangementPuissance.RawType>;
  autoriteInstructrice?: Lauréat.Puissance.AutoritéCompétente.RawType;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/puissance/modifier`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/demander`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/enregistrer`,
  détails: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/${demandéLe}`,
  téléchargerModèleRéponseAccordé: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/modele-reponse?estAccordé=true`,
  téléchargerModèleRéponseRejeté: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/modele-reponse?estAccordé=false`,
  lister: (filters: ListerFilters = {}) => {
    const searchParams = new URLSearchParams();

    if (filters?.statut?.length) {
      applyStatutFilter<Lauréat.Puissance.StatutChangementPuissance.RawType>(
        searchParams,
        filters.statut,
      );
    }

    if (filters?.autoriteInstructrice) {
      searchParams.set('autoriteInstructrice', filters.autoriteInstructrice);
    }

    return `/laureats/changements/puissance${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
