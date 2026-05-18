import { Lauréat } from '@potentiel-domain/projet';

import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

type ListerFilters = {
  statut?: Array<Lauréat.Puissance.StatutChangementPuissance.RawType>;
};

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/puissance/modifier`;

export const changement = {
  détailsPourRedirection: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/puissance/changement/demande`,
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
