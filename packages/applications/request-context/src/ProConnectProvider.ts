import { randomUUID } from 'node:crypto';

import { jwtVerify } from 'jose';
import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

import { mapToPlainObject, PlainType } from '@potentiel-domain/core';
import { IdentifiantUtilisateur, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getJwks } from './openid';
import { getUtilisateurFromEmail } from './getUtilisateur';

export type ProConnectProfile = {
  email: string;
  given_name: string;
  usual_name: string;
  uid: string;
  siret: string;
  utilisateur: PlainType<Utilisateur.ValueType>;
};

export default function ProConnect<P extends ProConnectProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: 'proconnect',
    name: 'ProConnect',
    type: 'oauth',
    idToken: true,
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: 'openid uid given_name usual_name email siret',
        acr_values: 'eidas1',
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
        const userInfo = await fetch(`${options.issuer}/userinfo`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.tokens.access_token}`,
          },
        }).then((res) => res.text());

        const jwks = await getJwks('proconnect');
        const { payload } = await jwtVerify(userInfo, jwks);

        return payload;
      },
    },
    profile: async (profile) => {
      const utilisateur = await getUtilisateurFromEmail(profile.email);

      if (Option.isNone(utilisateur)) {
        return {
          id: Option.none.type,
          nom: '',
          groupe: Option.none,
          role: Role.porteur,
          identifiantUtilisateur: IdentifiantUtilisateur.unknownUser,
        };
      }

      return {
        id: profile.uid,
        ...mapToPlainObject(utilisateur),
      };
    },
    options,
  };
}
