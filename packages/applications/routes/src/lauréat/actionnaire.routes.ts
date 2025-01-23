import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/modifier`;
export const détails = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire`;

export const changement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire/demander`,
  téléchargerModèleRéponse: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire/modele-reponse`,
  lister: `/laureats/changements/actionnaire`,
};
