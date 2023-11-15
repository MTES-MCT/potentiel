import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getAccessToken } from './getAccessToken';

export const getUser = async () => {
  const accessToken = await getAccessToken();
  return accessToken && Utilisateur.convertirEnValueType(accessToken);
};
