import { encodeParameter } from '../encodeParameter';

export const choisir = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/cahier-des-charges`;
