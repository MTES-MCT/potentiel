import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const changement = {
  détail: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/representant-legal`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/representant-legal/demander`,
  lister: `/laureats/changements/representant-legal`,
};
