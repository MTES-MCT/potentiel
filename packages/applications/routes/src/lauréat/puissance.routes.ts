import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/puissance/modifier`;
