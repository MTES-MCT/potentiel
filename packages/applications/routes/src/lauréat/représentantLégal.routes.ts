import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const demanderChangement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/demander-changement`;
