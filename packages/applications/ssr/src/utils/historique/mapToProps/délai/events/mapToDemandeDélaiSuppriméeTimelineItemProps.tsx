import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiSuppriméeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiSuppriméeEvent,
) => {
  const { suppriméLe } = record.payload;

  return {
    date: suppriméLe,
    title: <div>Demande de délai supprimée suite à l'accord de l'abandon</div>,
  };
};
