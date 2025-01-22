import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const changement = {
  détail: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/representant-legal?demandeLe=${demandéLe}`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/representant-legal/demander`,
  lister: `/laureats/changements/representant-legal`,
};
