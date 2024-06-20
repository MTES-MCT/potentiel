import { mediator } from 'mediateur';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { permissionMiddleware } from '@potentiel-domain/utilisateur';

import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

mediator.register('System.Authorization.RécupérerUtilisateur', getAuthenticatedUser);

export const BootstrapApp = async () => {
  await bootstrap({ middlewares: [permissionMiddleware] });
  return null;
};
