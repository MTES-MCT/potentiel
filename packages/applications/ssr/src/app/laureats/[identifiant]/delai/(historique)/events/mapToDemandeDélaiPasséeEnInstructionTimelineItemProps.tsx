import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeDélaiPasséeEnInstructionTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent,
): TimelineItemProps => {
  const { passéeEnInstructionLe, passéeEnInstructionPar } = event.payload;

  return {
    date: passéeEnInstructionLe,
    title: 'Demande de délai passée en instruction',
    actor: passéeEnInstructionPar,
  };
};
