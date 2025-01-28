import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const changement = {
  détail: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/demander`,
  corriger: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/changement/${demandéLe}/corriger`,
  lister: `/laureats/changements/representant-legal?statut=demandé`,
};
