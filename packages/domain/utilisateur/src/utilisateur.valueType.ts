import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { Région, Zone } from '.';

import * as Role from './role.valueType';

export type ValueType = ReadonlyValueType<{
  identifiantUtilisateur: Email.ValueType;
  role: Role.ValueType;
  région: Région.ValueType | undefined;
  identifiantGestionnaireRéseau: string | undefined;
  zone: Zone.ValueType | undefined;
}>;

export const bind = ({
  identifiantUtilisateur: { email },
  role,
  région,
  identifiantGestionnaireRéseau,
  zone,
}: PlainType<ValueType>): ValueType => {
  const identifiantUtilisateur = Email.convertirEnValueType(email);
  return {
    role: Role.bind(role),
    identifiantUtilisateur,
    région: région ? Région.bind(région) : undefined,
    identifiantGestionnaireRéseau,
    zone: zone ? Zone.bind(zone) : undefined,
    estÉgaleÀ(valueType) {
      return (
        this.identifiantUtilisateur.estÉgaleÀ(identifiantUtilisateur) &&
        this.role.estÉgaleÀ(valueType.role) &&
        this.identifiantGestionnaireRéseau === valueType.identifiantGestionnaireRéseau &&
        (this.zone && valueType.zone
          ? this.zone.estÉgaleÀ(valueType.zone)
          : !this.zone && !this.zone) &&
        (this.région && valueType.région
          ? this.région.estÉgaleÀ(valueType.région)
          : !this.région && !this.région)
      );
    },
  };
};

type ConvertirEnValueTypeProps = {
  identifiantUtilisateur: string;
  role: string;
  région: string | undefined;
  identifiantGestionnaireRéseau: string | undefined;
  zone: string | undefined;
};
export const convertirEnValueType = ({
  identifiantUtilisateur,
  role,
  région,
  identifiantGestionnaireRéseau,
  zone,
}: ConvertirEnValueTypeProps) =>
  bind({
    identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
    role: Role.convertirEnValueType(role),
    région: région ? Région.convertirEnValueType(région) : undefined,
    identifiantGestionnaireRéseau: identifiantGestionnaireRéseau ?? undefined,
    zone: zone ? Zone.convertirEnValueType(zone) : undefined,
  });
