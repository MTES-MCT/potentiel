import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter.js';
import { withFilters } from '../_helpers/withFilters.js';

type ListerFilters = {
  statut?: Array<Lauréat.Puissance.StatutChangementPuissance.RawType>;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/puissance/modifier`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/demander`,
  détails: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/${demandéLe}`,
  téléchargerModèleRéponseAccordé: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/modele-reponse?estAccordé=true`,
  téléchargerModèleRéponseRejeté: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/modele-reponse?estAccordé=false`,
  lister: withFilters<ListerFilters>(`/laureats/changements/puissance`),
};
