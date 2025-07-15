import { DateTime } from '@potentiel-domain/common';

import { encodeParameter } from '../encodeParameter';

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const lister = `/laureats/changements/delai`;

export const téléchargerModèleRéponse = (
  identifiantProjet: string,
  date: DateTime.RawType,
  estAccordé: boolean,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/délai/${date}/modele-reponse?estAccordé=${estAccordé}`;
