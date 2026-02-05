import { encodeParameter } from '../encodeParameter.js';

export const afficher = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/historique`;
