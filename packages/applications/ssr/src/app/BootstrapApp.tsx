import { getAccessTokenHandler } from '@/bootstrap/getAccessToken.handler';
import { mediator } from 'mediateur';

mediator.register('GET_ACCESS_TOKEN', getAccessTokenHandler);

export const BootstrapApp = () => {
  return null;
};
