import { decodeJwt } from 'jose';
import { z } from 'zod';

import { OperationRejectedError, PlainType } from '@potentiel-domain/core';
import { Role, Groupe, IdentifiantUtilisateur, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const convertToken = (token: string): PlainType<Utilisateur.ValueType> => {
  const { email, nom, roles, groupes } = parseToken(token);

  const role = roles.find((r) => Role.estUnRoleValide(r));
  const groupe = groupes.find((g) => Groupe.estUnGroupeValide(g));

  return {
    role: Role.convertirEnValueType(role ?? ''),
    groupe: groupe ? Groupe.convertirEnValueType(groupe) : Option.none,
    nom,
    identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(email),
  };
};

const jwtSchema = z.object({
  name: z.string().default(''),
  email: z.string(),
  realm_access: z.object({
    roles: z.array(z.string()),
  }),
  groups: z.array(z.string()).optional(),
});

const parseToken = (token: string) => {
  try {
    if (!token) {
      throw new EmptyTokenError();
    }

    const decodedJwt = decodeJwt(token);
    const {
      name,
      email,
      realm_access: { roles },
      groups,
    } = jwtSchema.parse(decodedJwt);

    return {
      nom: name,
      email,
      roles,
      groupes: groups ?? [],
    };
  } catch (e) {
    throw new TokenInvalideError(e as Error);
  }
};

class TokenInvalideError extends OperationRejectedError {
  constructor(cause: Error) {
    super(`Le format du token utilisateur n'est pas valide.`);
    this.cause = cause;
  }
}

class EmptyTokenError extends Error {
  constructor() {
    super(`Token vide`);
  }
}
