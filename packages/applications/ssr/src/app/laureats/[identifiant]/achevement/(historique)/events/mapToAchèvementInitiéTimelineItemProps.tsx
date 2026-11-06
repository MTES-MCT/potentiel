import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAchèvementInitiéTimelineItemProps = (
  event: Lauréat.Achèvement.AchèvementInitiéEvent,
): TimelineItemProps => {
  const { initiéLe, initiéPar } = event.payload;

  return {
    date: initiéLe,
    title: 'Achèvement initié',
    actor: initiéPar,
  };
};
