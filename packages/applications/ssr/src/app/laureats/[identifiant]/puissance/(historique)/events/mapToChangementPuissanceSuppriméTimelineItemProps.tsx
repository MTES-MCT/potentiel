import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceSuppriméTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceSuppriméEvent,
): TimelineItemProps => {
  const { suppriméLe } = event.payload;

  return {
    date: suppriméLe,
    title: 'Demande de changement de puissance supprimée',
    reason: 'Abandon accordé',
  };
};
