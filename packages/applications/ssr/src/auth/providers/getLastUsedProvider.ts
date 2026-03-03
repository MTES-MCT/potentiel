import { LastLoginMethodOptions } from 'better-auth/plugins';

import { auth } from '..';

import { AuthProvider } from './authProvider';

export const getLastUsedProvider = ({ headers }: { headers: Headers }) => {
  const lastLoginMethodPlugin = auth.options.plugins.find((x) => x.id === 'last-login-method');
  if (!lastLoginMethodPlugin) {
    return;
  }

  const options = lastLoginMethodPlugin.options as LastLoginMethodOptions;
  const cookieName = options?.cookieName ?? 'better-auth.last_used_login_method';
  const lastUsedProvider = headers
    .get('cookie')
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith(`${cookieName}=`))
    ?.split('=')[1];

  return lastUsedProvider as AuthProvider;
};
