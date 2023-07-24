import ROUTES from '@routes';

import type { Action } from '../getProjectActionsByRole';
import { ProjectActionProps } from '../../components/Actions';

export const drealActions = (project: ProjectActionProps['project']) => {
  const actions: Action[] = [];
  const { garantiesFinancières } = project;

  if (project.isAbandoned) return [];

  if (!garantiesFinancières) return actions;

  if (garantiesFinancières.statut === 'à traiter') {
    actions.push({
      title: 'Marquer la garantie financière comme validée',
      link: ROUTES.VALIDER_GF({
        projetId: project.id,
      }),
    });
  } else if (garantiesFinancières.statut === 'validé') {
    actions.push({
      title: 'Marquer la garantie financière comme à traiter',
      link: ROUTES.INVALIDER_GF({
        projetId: project.id,
      }),
    });
  }
  return actions;
};
