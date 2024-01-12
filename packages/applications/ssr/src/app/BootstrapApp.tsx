import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';
import { mediator } from 'mediateur';

mediator.register('GET_AUTHENTICATED_USER', getAuthenticatedUser);

export const BootstrapApp = () => {
  return null;
};
