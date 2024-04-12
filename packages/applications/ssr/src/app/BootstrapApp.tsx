import { mediator } from 'mediateur';

import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

mediator.register('System.Authorization.RécupérerUtilisateur', getAuthenticatedUser);

export const BootstrapApp = () => {
  return null;
};
