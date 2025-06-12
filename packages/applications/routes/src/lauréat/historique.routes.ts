import { encodeParameter } from '../encodeParameter';

export const afficher = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/historique`;
