import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAbandonConfirméTimelineItemProps = (
  event: Lauréat.Abandon.AbandonConfirméEvent,
): TimelineItemProps => {
  const { confirméLe, confirméPar } = event.payload;

  return {
    date: confirméLe,
    title: "Demande d'abandon confirmée",
    actor: confirméPar,
  };
};
