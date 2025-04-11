import { Puissance } from '@potentiel-domain/laureat';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Puissance.StatutChangementPuissance.RawType;
  autoriteInstructrice?: Puissance.RatioChangementPuissance.AutoritéCompétente;
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

    if (filters?.statut) {
      searchParams.set('statut', filters.statut);
    }

    if (filters?.autoriteInstructrice) {
      searchParams.set('autoriteInstructrice', filters.autoriteInstructrice);
    }

    return `/laureats/changements/puissance${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
};
