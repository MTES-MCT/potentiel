import { encodeParameter } from '../encodeParameter.js';

export const signaler = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/power-purchase-agreement/signaler`;
