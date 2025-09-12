import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementActionnaireSuppriméTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent,
) => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: (
      <div>Demande de modification de l'actionnaire supprimée suite à l'accord de l'abandon</div>
    ),
  };
};
