import { encodeParameter } from '../encodeParameter';

export const transmettre = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/transmettre`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/modifier`;

export const demanderChangement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire/demander`;
