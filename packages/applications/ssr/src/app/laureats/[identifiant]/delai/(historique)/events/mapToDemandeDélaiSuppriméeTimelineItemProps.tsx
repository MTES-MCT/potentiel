import type { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiSuppriméeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiSuppriméeEvent | Lauréat.Délai.DemandeDélaiSuppriméeEventV1,
) => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: 'Demande de délai supprimée',
    reason: 'Abandon accordé',
  };
};
