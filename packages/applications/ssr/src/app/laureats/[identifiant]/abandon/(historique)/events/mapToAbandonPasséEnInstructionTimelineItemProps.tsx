import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAbandonPasséEnInstructionTimelineItemProps = (
  event: Lauréat.Abandon.AbandonPasséEnInstructionEvent,
): TimelineItemProps => {
  const { passéEnInstructionLe, passéEnInstructionPar } = event.payload;

  return {
    date: passéEnInstructionLe,
    title: "Demande d'abandon passée en instruction",
    acteur: passéEnInstructionPar,
  };
};
