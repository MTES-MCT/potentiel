import { mediator } from 'mediateur';

import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

mediator.register('GET_AUTHENTICATED_USER', getAuthenticatedUser);

export const BootstrapApp = () => {
  return null;
};
