import { randomUUID } from 'node:crypto';

import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export type ProConnectProfile = {
  email: string;
  given_name: string;
  usual_name: string;
  uid: string;
  siret: string;
};

export default function ProConnect<P extends ProConnectProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: 'proconnect',
    name: 'ProConnect',
    type: 'oauth',
    idToken: true,
    wellKnown: new URL('/api/v2/.well-known/openid-configuration', options.issuer).toString(),
    authorization: {
      params: {
        scope: 'openid uid given_name usual_name email siret',
        acr_values: 'eidas1',
        // redirect_uri: new URL('/api/auth/callback/proconnect', process.env.NEXTAUTH_URL).toString(),
        nonce: randomUUID(),
        state: randomUUID(),
      },
    },
    checks: ['nonce', 'state'],
    client: {
      authorization_signed_response_alg: 'RS256',
      id_token_signed_response_alg: 'RS256',
      userinfo_encrypted_response_alg: 'RS256',
      userinfo_signed_response_alg: 'RS256',
      userinfo_encrypted_response_enc: 'RS256',
    },
    userinfo: {
      async request(context) {
        const userInfo = await fetch(
          new URL('api/v2/userinfo', process.env.PROCONNECT_ENDPOINT).toString(),
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          },
        ).then((res) => {
          return res.text();
        });
        return JSON.parse(Buffer.from(userInfo.split('.')[1], 'base64').toString());
      },
    },
    profile: async (profile) => {
      console.log(JSON.stringify(profile));

      return {
        id: profile.uid,
        email: profile.email,
        given_name: profile.given_name,
        usual_name: profile.usual_name,
      };
    },
    options,
  };
}
