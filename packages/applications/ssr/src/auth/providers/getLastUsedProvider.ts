import { cookies } from 'next/headers';
import { LastLoginMethodOptions } from 'better-auth/plugins';

import { auth } from '..';

import { AuthProvider } from './authProvider';

export const getLastUsedProvider = () => {
  const lastLoginMethodPlugin = auth.options.plugins.find((x) => x.id === 'last-login-method');
  if (!lastLoginMethodPlugin) {
    return;
  }

  const options = lastLoginMethodPlugin.options as LastLoginMethodOptions;
  const lastUsedProvider = cookies().get(
    options?.cookieName ?? 'better-auth.last_used_login_method',
  )?.value;

  return lastUsedProvider as AuthProvider;
};
