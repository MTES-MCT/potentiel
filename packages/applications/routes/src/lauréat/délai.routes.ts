import { DateTime } from '@potentiel-domain/common';

import { encodeParameter } from '../encodeParameter';

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;

export const détail = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}`;

export const corriger = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/corriger`;

export const lister = `/laureats/changements/delai?statut=demandé`;

export const téléchargerModèleRéponse = (identifiantProjet: string, date: DateTime.RawType) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/${date}/modele-reponse`;
