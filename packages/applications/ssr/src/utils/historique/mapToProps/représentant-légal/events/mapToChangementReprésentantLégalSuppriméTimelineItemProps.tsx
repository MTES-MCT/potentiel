import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalSuppriméTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: (
      <div>
        Demande de modification de représentant légal supprimée suite à l'accord de l'abandon
      </div>
    ),
  };
};
