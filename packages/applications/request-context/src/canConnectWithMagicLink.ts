import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

export const canConnectWithMagicLink = (role: PlainType<Role.ValueType>) => {
  const roleValueType = Role.bind(role);
  const admin = roleValueType.estÉgaleÀ(Role.admin);
  const dgecval = roleValueType.estÉgaleÀ(Role.dgecValidateur);
  const dreal = roleValueType.estÉgaleÀ(Role.dreal);

  return !(admin || dgecval || dreal);
};
