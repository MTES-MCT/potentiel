import ROUTES from '@routes';

const drealActions = (project: {
  id: string;
  garantiesFinancières: {
    id: string;
    statut: 'à traiter' | 'validé' | 'en attente';
  };
  isAbandoned: boolean;
}) => {
  const actions: any = [];
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

export { drealActions };
