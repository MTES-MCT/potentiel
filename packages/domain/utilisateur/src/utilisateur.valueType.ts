import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';

import * as Role from './role.valueType';
import * as Groupe from './groupe.valueType';

export type ValueType = ReadonlyValueType<{
  nom: string;
  identifiantUtilisateur: Email.ValueType;
  role: Role.ValueType;
  groupe: Option.Type<Groupe.ValueType>;
}>;

export const bind = ({
  nom,
  identifiantUtilisateur,
  groupe,
  role,
}: PlainType<ValueType>): ValueType => {
  const _identifiantUtilisateur = Email.bind(identifiantUtilisateur);
  return {
    nom,
    role: Role.bind(role),
    identifiantUtilisateur: _identifiantUtilisateur,
    groupe: Option.isSome(groupe) ? Groupe.bind(groupe) : Option.none,
    estÉgaleÀ(valueType) {
      return this.nom === valueType.nom &&
        this.identifiantUtilisateur.estÉgaleÀ(_identifiantUtilisateur) &&
        this.role.estÉgaleÀ(valueType.role) &&
        Option.isSome(this.groupe)
        ? Option.isSome(valueType.groupe) && this.groupe.estÉgaleÀ(valueType.groupe)
        : Option.isNone(valueType.groupe);
    },
  };
};
