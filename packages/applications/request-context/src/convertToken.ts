import { z } from 'zod';
import { jwtVerify } from 'jose';

import { PlainType } from '@potentiel-domain/core';
import { Role, Groupe, IdentifiantUtilisateur, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getJwks } from './openid';

const jwtSchema = z.object({
  name: z.string().default(''),
  email: z.string(),
  realm_access: z.object({
    roles: z.array(z.string()),
  }),
  groups: z.array(z.string()).optional(),
});

export const convertToken = async (
  accessToken: string,
): Promise<PlainType<Utilisateur.ValueType>> => {
  const jwks = await getJwks();
  const { payload } = await jwtVerify(accessToken, jwks);

  const {
    email,
    name: nom,
    realm_access: { roles },
    groups: groupes,
  } = jwtSchema.parse(payload);

  const role = roles.find((r) => Role.estUnRoleValide(r));
  const groupe = groupes?.find((g) => Groupe.estUnGroupeValide(g));

  return {
    role: Role.convertirEnValueType(role ?? ''),
    groupe: groupe ? Groupe.convertirEnValueType(groupe) : Option.none,
    nom,
    identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(email),
  };
};
