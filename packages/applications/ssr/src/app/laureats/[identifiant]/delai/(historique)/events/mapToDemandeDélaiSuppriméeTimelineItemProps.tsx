import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiSuppriméeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiSuppriméeEvent,
) => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: "Demande de délai supprimée suite à l'accord de l'abandon",
  };
};
