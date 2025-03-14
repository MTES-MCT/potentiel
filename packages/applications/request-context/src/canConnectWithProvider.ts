import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

const canConnectWithMagicLink = (role: PlainType<Role.ValueType>) => {
  const roleValueType = Role.bind(role);
  const admin = roleValueType.estÉgaleÀ(Role.admin);
  const dgecval = roleValueType.estÉgaleÀ(Role.dgecValidateur);
  const dreal = roleValueType.estÉgaleÀ(Role.dreal);

  return !(admin || dgecval || dreal);
};

const canConnectWithProConnect = (role: PlainType<Role.ValueType>) => {
  const roleValueType = Role.bind(role);
  return (
    roleValueType.estÉgaleÀ(Role.admin) ||
    roleValueType.estÉgaleÀ(Role.dgecValidateur) ||
    roleValueType.estÉgaleÀ(Role.dreal)
  );
};

export const canConnectWithProvider = (
  provider: 'email' | 'proconnect',
  role: PlainType<Role.ValueType>,
) => {
  return match(provider)
    .with('email', () => canConnectWithMagicLink(role))
    .with('proconnect', () => canConnectWithProConnect(role))
    .otherwise(() => false);
};
