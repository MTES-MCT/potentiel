import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps = (
  event: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent,
): TimelineItemProps => {
  const { demandéeLe } = event.payload;

  return {
    date: demandéeLe,
    title: 'Preuve de recandidature demandée',
  };
};
