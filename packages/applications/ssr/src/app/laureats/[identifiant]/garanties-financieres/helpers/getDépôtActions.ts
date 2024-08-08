import { Role } from '@potentiel-domain/utilisateur';

import { DépôtGarantiesFinancières } from '@/components/organisms/garantiesFinancières/types';
import { AuthenticatedUserReadModel } from '@/utils/getAuthenticatedUser.handler';

export const getDépôtActions = (role: AuthenticatedUserReadModel['role']) => {
  const actions: DépôtGarantiesFinancières['actions'] = [];

  if (role.estÉgaleÀ(Role.admin)) {
    actions.push('modifier');
  }
  if (role.estÉgaleÀ(Role.dreal)) {
    actions.push('instruire', 'modifier');
  }
  if (role.estÉgaleÀ(Role.porteur)) {
    actions.push('modifier', 'supprimer');
  }

  return actions;
};
