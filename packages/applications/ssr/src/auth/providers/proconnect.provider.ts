import type { OAuth2Tokens } from 'better-auth';
import type { BaseOAuthProviderOptions, GenericOAuthConfig } from 'better-auth/plugins';
import { jwtVerify } from 'jose';

import type { CustomProfile } from '../profile';
import { getJWKS, getOpenIdConfiguration } from './openid';

export interface ProconnectOptions extends BaseOAuthProviderOptions {
  /**
   * Proconnect issuer URL (e.g., https://fca.integ01.dev-agentconnect.fr/api/v2)
   * This will be used to construct the discovery URL.
   */
  issuer: string;
}

interface ProconnectUserInfo {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  usual_name?: string;
  given_name?: string;
  siret?: string;
  idp_id?: string;
}

interface ProconnectIdToken {
  // https://partenaires.proconnect.gouv.fr/docs/ressources/claim_amr
  amr?: string[];
  // https://partenaires.proconnect.gouv.fr/docs/fournisseur-service/niveaux-acr
  acr?: string;
}

// for internal use only, not exposed outside the proconnect authentication process.
type Profile = {
  id: string;
  email?: string;
  emailVerified: boolean;
  name?: string;
} & CustomProfile;

export function proconnect(options: ProconnectOptions): GenericOAuthConfig {
  const defaultScopes = [
    'openid',
    'uid',
    'given_name',
    'usual_name',
    'email',
    'siret',
    'offline_access',
    'idp_id',
    'acr',
  ];

  // https://partenaires.proconnect.gouv.fr/docs/ressources/claim_amr
  const authorizationParams = {
    claims: JSON.stringify({ id_token: { amr: null, acr: null } }),
  };

  // Ensure issuer ends without trailing slash for proper discovery URL construction
  const issuer = options.issuer.replace(/\/$/, '');
  const discoveryUrl = `${issuer}/.well-known/openid-configuration`;

  // https://partenaires.proconnect.gouv.fr/docs/fournisseur-service/implementation_technique#236-récupération-des-user-info
  const getUserInfo = async (tokens: OAuth2Tokens): Promise<Profile | null> => {
    const discovery = await getOpenIdConfiguration(discoveryUrl);

    const userInfoUrl = new URL(discovery.userinfo_endpoint ?? `${issuer}/userinfo`);
    userInfoUrl.searchParams.set('scopes', defaultScopes.join(' '));
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
      const profile = (await userInfoResponse.json()) as ProconnectUserInfo;
      return mapUserInfoToProfile(profile, {});
    }

    const jwks = await getJWKS(discoveryUrl);

    if (!contentType.includes('application/jwt')) {
      throw new Error(`Unsupported content type for user info response: ${contentType}`);
    }
    const userInfoJwt = await userInfoResponse.text();

    const decodedUserInfo = (await jwtVerify<ProconnectUserInfo>(userInfoJwt, jwks)).payload;

    const decodedIdToken = tokens.idToken
      ? (await jwtVerify<ProconnectIdToken>(tokens.idToken, jwks)).payload
      : {};

    return mapUserInfoToProfile(decodedUserInfo, decodedIdToken);
  };

  return {
    providerId: 'proconnect',
    discoveryUrl,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    scopes: defaultScopes,
    authorizationUrlParams: () => authorizationParams,
    redirectURI: options.redirectURI,
    pkce: options.pkce ?? true,
    disableImplicitSignUp: options.disableImplicitSignUp,
    disableSignUp: options.disableSignUp,
    overrideUserInfo: true,
    getUserInfo,
    mapProfileToUser,
  };
}

const mapProfileToUser = (profile: Record<string, unknown>): Record<string, unknown> => ({
  ...profile,
  accountUrl: process.env.PROCONNECT_ACCOUNT ?? '',
  provider: 'proconnect',
  custom: profile.custom ?? {},
});

const mapUserInfoToProfile = (
  {
    sub: id,
    email,
    email_verified,
    name,
    given_name,
    usual_name,
    siret,
    idp_id,
  }: ProconnectUserInfo,
  { amr }: ProconnectIdToken,
) => ({
  id,
  email,
  emailVerified: email_verified ?? false,
  name:
    given_name && usual_name ? `${given_name} ${usual_name}` : (name ?? usual_name ?? given_name),
  custom: {
    amr,
    siret,
    idp_id,
  },
});
