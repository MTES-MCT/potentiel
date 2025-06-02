import { encodeParameter } from '../encodeParameter';

export const details = (identifiantProjet: string) =>
  `/elimine/${encodeParameter(identifiantProjet)}`;
