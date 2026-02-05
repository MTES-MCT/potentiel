import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter.js';
import { withFilters } from '../_helpers/withFilters.js';

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
  lister: withFilters<ListerFilters>(`/laureats/changements/actionnaire`),
};
