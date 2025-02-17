import * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';

export type UtilisateurEntity = {
  identifiantUtilisateur: IdentifiantUtilisateur.RawType;
  email: string;
  rôle: string;
  nomComplet: string;
  fonction: string;
  régionDreal?: string;
};
