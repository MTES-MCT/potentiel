import { encodeParameter } from '../encodeParameter.js';

export const changement = {
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/producteur/changement/enregistrer`,
  détails: (identifiantProjet: string, enregistréLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/producteur/changement/${enregistréLe}`,
  lister: `/laureats/changements/producteur`,
};
export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/producteur/modifier`;
