import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import * as Role from './role.valueType';

export type ValueType = ReadonlyValueType<{
  nom: string;
  identifiantUtilisateur: Email.ValueType;
  role: Role.ValueType;
  région: Option.Type<string>;
  identifiantGestionnaireRéseau: Option.Type<string>;
}>;

export const bind = ({
  nom,
  identifiantUtilisateur: { email },
  role,
  région,
  identifiantGestionnaireRéseau,
}: PlainType<ValueType>): ValueType => {
  const identifiantUtilisateur = Email.convertirEnValueType(email);
  return {
    nom,
    role: Role.bind(role),
    identifiantUtilisateur,
    région,
    identifiantGestionnaireRéseau,
    estÉgaleÀ(valueType) {
      return (
        this.nom === valueType.nom &&
        this.région === valueType.région &&
        this.identifiantGestionnaireRéseau === valueType.identifiantGestionnaireRéseau &&
        this.identifiantUtilisateur.estÉgaleÀ(identifiantUtilisateur) &&
        this.role.estÉgaleÀ(valueType.role)
      );
    },
  };
};
