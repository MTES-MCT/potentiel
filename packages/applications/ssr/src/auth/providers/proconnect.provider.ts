import { OAuth2Tokens, User } from 'better-auth';
import { BaseOAuthProviderOptions, GenericOAuthConfig } from 'better-auth/plugins';
import { jwtVerify } from 'jose';

import { getJWKS, getOpenIdConfiguration } from './discovery';

export interface ProconnectOptions extends BaseOAuthProviderOptions {
  /**
   * Proconnect issuer URL (e.g., https://fca.integ01.dev-agentconnect.fr/api/v2)
   * This will be used to construct the discovery URL.
   */
  issuer: string;
}

interface ProconnectProfile {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  usual_name?: string;
  given_name?: string;
}

export function proconnect(options: ProconnectOptions): GenericOAuthConfig {
  const defaultScopes = ['openid', 'profile', 'email'];

  // Ensure issuer ends without trailing slash for proper discovery URL construction
  const issuer = options.issuer.replace(/\/$/, '');
  const discoveryUrl = `${issuer}/.well-known/openid-configuration`;

  // https://partenaires.proconnect.gouv.fr/docs/fournisseur-service/implementation_technique#236-récupération-des-user-info
  const getUserInfo = async (tokens: OAuth2Tokens) => {
    const discovery = await getOpenIdConfiguration(discoveryUrl);

    const userInfoUrl = discovery.userinfo_endpoint ?? `${issuer}/userinfo`;
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      return null;
    }

    const contentType = userInfoResponse.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const profile = (await userInfoResponse.json()) as ProconnectProfile;
      return mapUserInfoToProfile(profile);
    }

    const jwks = await getJWKS(discoveryUrl);

    if (!contentType.includes('application/jwt')) {
      throw new Error(`Unsupported content type for user info response: ${contentType}`);
    }
    const userInfoJwt = await userInfoResponse.text();

    const { payload } = await jwtVerify<ProconnectProfile>(userInfoJwt, jwks);
    return mapUserInfoToProfile(payload);
  };

  return {
    providerId: 'proconnect',
    discoveryUrl,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    scopes: options.scopes ?? defaultScopes,
    redirectURI: options.redirectURI,
    pkce: options.pkce,
    disableImplicitSignUp: options.disableImplicitSignUp,
    disableSignUp: options.disableSignUp,
    overrideUserInfo: options.overrideUserInfo,
    getUserInfo,
    mapProfileToUser,
  };
}

const mapProfileToUser = (
  profile: Record<string, string>,
): Partial<User> & { accountUrl: string } => ({
  ...profile,
  accountUrl: process.env.PROCONNECT_ACCOUNT!,
});

const mapUserInfoToProfile = ({
  sub: id,
  email,
  email_verified,
  name,
  given_name,
  usual_name,
}: ProconnectProfile) => ({
  id,
  email,
  emailVerified: email_verified ?? false,
  name:
    given_name && usual_name ? `${given_name} ${usual_name}` : (name ?? usual_name ?? given_name),
});
