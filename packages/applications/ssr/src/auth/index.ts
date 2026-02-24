import { betterAuth } from 'better-auth';
import { genericOAuth, lastLoginMethod } from 'better-auth/plugins';

import {
  getKeycloakConfiguration,
  getProconnectConfiguration,
} from './providers/getProviderConfiguration';
import { proconnect } from './providers/proconnect.provider';
import { customKeycloak } from './providers/keycloak.provider';
import { customMagicLink } from './providers/magicLink.provider';
import { getProviders } from './providers/authProvider';
import { auditLogs } from './plugins/audit-log.plugin';

const isDefined = <T extends object>(val: T | boolean | undefined): val is T => !!val;

const providers = getProviders();
const oauthProviders = [
  providers.keycloak && customKeycloak(getKeycloakConfiguration()),
  providers.proconnect && proconnect(getProconnectConfiguration()),
].filter(isDefined);

export const auth = betterAuth({
  user: {
    additionalFields: {
      accountUrl: { type: 'string' },
      provider: { type: 'string' },
    },
  },
  session: {
    cookieCache: {
      maxAge: 60 * 60 * 12, // 12 hours
    },
  },
  plugins: [
    oauthProviders.length > 0 && genericOAuth({ config: oauthProviders }),
    providers['magic-link'] && customMagicLink(),
    lastLoginMethod({
      customResolveMethod: (ctx) => (ctx.path === '/magic-link/verify' ? 'magic-link' : null),
    }),
    auditLogs(),
  ].filter(isDefined),
});
