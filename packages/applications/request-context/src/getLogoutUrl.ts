import { EndSessionParameters } from 'openid-client';

import { getOpenIdClient } from './openid';

export const getLogoutUrl = async (params: EndSessionParameters, provider: string) => {
  const client = await getOpenIdClient(provider);
  return client.endSessionUrl(params);
};
