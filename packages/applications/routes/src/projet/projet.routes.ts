import { encodeParameter } from '../encodeParameter';

export const details = (identifiantProjet: string) =>
  `/projet/${encodeParameter(identifiantProjet)}/details.html`;
