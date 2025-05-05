import { encodeParameter } from '../encodeParameter';

export const changement = {
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/producteur/changement/enregistrer`,
  lister: `/laureats/changements/producteur`,
};
export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/producteur/modifier`;
