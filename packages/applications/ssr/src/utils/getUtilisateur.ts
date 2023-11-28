import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getAccessToken } from './getAccessToken';

export type Utilisateur = {
  rôle:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'ademe'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  email: string;
  nom: string;
};

export const getUser = async (): Promise<Utilisateur | undefined> => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return;
  }
  const rawUser = Utilisateur.convertirEnValueType(accessToken);
  return { rôle: rawUser.role.nom, email: rawUser.identifiantUtilisateur.email, nom: rawUser.nom };
};
