import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalSuppriméTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
): TimelineItemProps => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: "Demande de modification de représentant légal supprimée suite à l'accord de l'abandon",
  };
};
