import type { OAuth2Tokens } from 'better-auth';
import type { BaseOAuthProviderOptions, GenericOAuthConfig } from 'better-auth/plugins';
import { jwtVerify } from 'jose';

import { setCustomProfile } from '../profile';
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

type Profile = {
  id: string;
  email?: string;
  emailVerified: boolean;
  name?: string;
};

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
    const jwks = await getJWKS(discoveryUrl);

    const decodedIdToken = tokens.idToken
      ? (await jwtVerify<ProconnectIdToken>(tokens.idToken, jwks)).payload
      : {};

    const decodedUserInfo = await decodeUserInfo({ userInfoResponse, contentType, jwks });

    await setCustomProfile({
      siret: decodedUserInfo.siret,
      idp_id: decodedUserInfo.idp_id,
      amr: decodedIdToken.amr,
      acr: decodedIdToken.acr,
    });

    return mapUserInfoToProfile(decodedUserInfo);
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
  provider: 'proconnect',
});

type DecodeUserInfoProps = {
  userInfoResponse: Response;
  contentType: string;
  jwks: Awaited<ReturnType<typeof getJWKS>>;
};

const decodeUserInfo = async ({
  userInfoResponse,
  contentType,
  jwks,
}: DecodeUserInfoProps): Promise<ProconnectUserInfo> => {
  if (contentType.includes('application/json')) {
    return (await userInfoResponse.json()) as ProconnectUserInfo;
  }

  if (!contentType.includes('application/jwt')) {
    throw new Error(`Unsupported content type for user info response: ${contentType}`);
  }
  const userInfoJwt = await userInfoResponse.text();

  const payload = (await jwtVerify<ProconnectUserInfo>(userInfoJwt, jwks)).payload;

  return payload;
};

const mapUserInfoToProfile = ({
  sub: id,
  email,
  email_verified,
  name,
  given_name,
  usual_name,
}: ProconnectUserInfo): Profile => ({
  id,
  email,
  emailVerified: email_verified ?? false,
  name:
    given_name && usual_name ? `${given_name} ${usual_name}` : (name ?? usual_name ?? given_name),
});
