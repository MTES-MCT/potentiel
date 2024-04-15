import { encodeParameter } from '../encodeParameter';

export const lister = '/recours';

export const détail = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours`;

export const demander = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}/recours/modele-reponse`;
