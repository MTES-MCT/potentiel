import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceSuppriméTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceSuppriméEvent,
): TimelineItemProps => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: "Demande de modification de puissance supprimée suite à l'accord de l'abandon",
  };
};
