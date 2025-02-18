import { EndSessionParameters } from 'openid-client';

import { getOpenIdClient } from './openid';

export const getLogoutUrl = async (params: EndSessionParameters) => {
  const client = await getOpenIdClient();
  return client.endSessionUrl(params);
};
