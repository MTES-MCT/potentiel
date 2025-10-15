import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementPuissanceSuppriméTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceSuppriméEvent,
) => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: <div>Demande de modification de puissance supprimée suite à l'accord de l'abandon</div>,
  };
};
