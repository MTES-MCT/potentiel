import { Role } from '@potentiel-domain/utilisateur';

import { DépôtGarantiesFinancières } from '@/components/organisms/garantiesFinancières/types';

export const getDépôtActions = (role: Role.ValueType) => {
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
