import { encodeParameter } from '../encodeParameter';

export const transmettre = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/transmettre`;

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/actionnaire/modifier`;

export const changement = {
  détail: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire/demander`,
  téléchargerModèleRéponse: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement/actionnaire/modele-reponse`,
  lister: `/laureats/changements/actionnaire`,
};
