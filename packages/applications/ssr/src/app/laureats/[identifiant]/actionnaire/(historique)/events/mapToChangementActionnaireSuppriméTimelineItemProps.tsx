import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementActionnaireSuppriméTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent,
): TimelineItemProps => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: "Demande de modification de l'actionnaire supprimée suite à l'accord de l'abandon",
  };
};
