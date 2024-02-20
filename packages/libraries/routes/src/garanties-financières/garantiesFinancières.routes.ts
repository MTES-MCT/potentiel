import { encodeParameter } from '../encodeParameter';

export const soumettre = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financières/soumettre`;
