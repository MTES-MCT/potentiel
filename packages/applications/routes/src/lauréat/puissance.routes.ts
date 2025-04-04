import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/puissance/modifier`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/demander`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/enregistrer`,
};
