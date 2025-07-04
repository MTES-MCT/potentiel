import { encodeParameter } from '../encodeParameter';

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/delai/demander`;
