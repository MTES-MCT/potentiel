import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRecoursPasséEnInstructionTimelineItemProp = (
  event: Éliminé.Recours.RecoursPasséEnInstructionEvent,
): TimelineItemProps => {
  const { passéEnInstructionLe, passéEnInstructionPar } = event.payload;

  return {
    date: passéEnInstructionLe,
    title: 'Demande de recours passée en instruction',
    actor: passéEnInstructionPar,
  };
};
