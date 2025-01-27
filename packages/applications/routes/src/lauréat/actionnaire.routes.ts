import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/modifier`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/demander`,
  détail: (identifiantProjet: string, demandéLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/${demandéLe}`,
  téléchargerModèleRéponse: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/changement/modele-reponse`,
  lister: `/laureats/changements/actionnaire`,
};
