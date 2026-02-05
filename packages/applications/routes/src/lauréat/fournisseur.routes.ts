import { encodeParameter } from '../encodeParameter.js';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/fournisseur/modifier`;

export const changement = {
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/fournisseur/changement/enregistrer`,
  détails: (identifiantProjet: string, enregistréLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/fournisseur/changement/${enregistréLe}`,
  lister: `/laureats/changements/fournisseur`,
};
