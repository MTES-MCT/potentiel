import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

export const canConnectWithProConnect = (role: PlainType<Role.ValueType>) => {
  const roleValueType = Role.bind(role);
  return (
    roleValueType.estÉgaleÀ(Role.admin) ||
    roleValueType.estÉgaleÀ(Role.dgecValidateur) ||
    roleValueType.estÉgaleÀ(Role.dreal)
  );
};
