import { IdentifiantUtilisateur } from '.';

export type UtilisateurProjection = {
  identifiantUtilisateur: IdentifiantUtilisateur.RawType;
  email: string;
  nomComplet: string;
  fonction: string;
};
