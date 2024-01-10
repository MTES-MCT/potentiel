import { getAuthenticatedUserHandler } from '@/utils/getAuthenticatedUser.handler';
import { mediator } from 'mediateur';

mediator.register('GET_AUTHENTICATED_USER', getAuthenticatedUserHandler);

export const BootstrapApp = () => {
  return null;
};
