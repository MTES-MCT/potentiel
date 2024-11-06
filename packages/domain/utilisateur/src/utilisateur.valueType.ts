import { OperationRejectedError, ReadonlyValueType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import * as Role from './role.valueType';
import * as Groupe from './groupe.valueType';
import * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';

export type ValueType = ReadonlyValueType<{
  nom: string;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  role: Role.ValueType;
  groupe: Option.Type<Groupe.ValueType>;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  const { nom, identifiantUtilisateur, role, groupe } = convertToken(value);
  return {
    nom,
    identifiantUtilisateur,
    role,
    groupe,
    estÉgaleÀ(valueType) {
      return this.nom === valueType.nom &&
        this.identifiantUtilisateur.estÉgaleÀ(identifiantUtilisateur) &&
        this.role.estÉgaleÀ(valueType.role) &&
        Option.isSome(this.groupe)
        ? Option.isSome(valueType.groupe) && this.groupe.estÉgaleÀ(valueType.groupe)
        : Option.isNone(valueType.groupe);
    },
  };
};

const convertToken = (token: string) => {
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

const parseToken = (token: string) => {
  try {
    if (!token) {
      throw new EmptyTokenError();
    }
    console.log(token);
    const {
      name,
      email,
      realm_access: { roles },
      groups,
    } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as {
      name: string;
      email: string;
      realm_access: {
        roles: Array<string>;
      };
      groups: string[];
    };

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
