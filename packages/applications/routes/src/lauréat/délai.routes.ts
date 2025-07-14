import { DateTime } from '@potentiel-domain/common';

import { encodeParameter } from '../encodeParameter';

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const lister = `/laureats/changements/delai`;

export const téléchargerModèleRéponseRejeté = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/délai/demande/modele-reponse?estAccordé=false`;
