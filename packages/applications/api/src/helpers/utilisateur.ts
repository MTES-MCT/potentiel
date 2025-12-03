import { getContext } from '@potentiel-applications/request-context';

import { UnauthorizedError } from '../errors.js';

export const getUtilisateur = () => {
  const utilisateur = getContext()?.utilisateur;
  if (!utilisateur) {
    throw new UnauthorizedError('Utilisateur non authentifié.');
  }
  return utilisateur;
};
