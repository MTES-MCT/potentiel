import { createAuthClient } from 'better-auth/react';
import {
  genericOAuthClient,
  magicLinkClient,
  lastLoginMethodClient,
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [genericOAuthClient(), magicLinkClient(), lastLoginMethodClient()],
});
