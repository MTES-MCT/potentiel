import { mediator } from 'mediateur';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { permissionMiddleware } from '@potentiel-domain/utilisateur';

import { getOptionalAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

mediator.register('System.Authorization.RécupérerUtilisateur', getOptionalAuthenticatedUser);

export const BootstrapApp = async () => {
  await bootstrap({ middlewares: [permissionMiddleware] });
  return null;
};
