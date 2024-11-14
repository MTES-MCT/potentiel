import { encodeParameter } from '../encodeParameter';

export const corriger = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/corriger`;
