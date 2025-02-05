import { encodeParameter } from '../encodeParameter';

export const modifierLauréat = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/modifier`;
