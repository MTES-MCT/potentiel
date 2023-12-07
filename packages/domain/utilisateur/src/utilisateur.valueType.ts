import { ReadonlyValueType } from '@potentiel-domain/core';
import * as Role from './role.valueType';
import { IdentifiantUtilisateur } from '.';
import { EmptyTokenError, TokenInvalideError } from './token.error';

export type ValueType = ReadonlyValueType<{
  nom: string;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  role: Role.ValueType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  const { nom, identifiantUtilisateur, role } = convertToken(value);
  return {
    nom,
    identifiantUtilisateur,
    role,
    estÉgaleÀ(valueType) {
      return (
        this.nom === valueType.nom &&
        this.identifiantUtilisateur.estÉgaleÀ(identifiantUtilisateur) &&
        this.role.estÉgaleÀ(valueType.role)
      );
    },
  };
};

const convertToken = (token: string) => {
  const { email, nom, roles } = parseToken(token);

  const role = roles.find((r) => Role.estUnRoleValide(r));

  return {
    role: Role.convertirEnValueType(role ?? ''),
    nom,
    identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(email),
  };
};

const parseToken = (token: string) => {
  try {
    if (!token) {
      throw new EmptyTokenError();
    }
    const {
      name,
      email,
      realm_access: { roles },
    } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as {
      name: string;
      email: string;
      realm_access: {
        roles: Array<string>;
      };
    };

    return {
      nom: name,
      email,
      roles,
    };
  } catch (e) {
    throw new TokenInvalideError(e as Error);
  }
};
