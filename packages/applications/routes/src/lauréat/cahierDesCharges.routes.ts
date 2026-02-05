import { encodeParameter } from '../encodeParameter.js';

export const choisir = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/cahier-des-charges`;
