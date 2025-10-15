import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToAbandonPasséEnInstructionTimelineItemProps = (
  abandonPasséEnInstruction: Lauréat.Abandon.AbandonPasséEnInstructionEvent,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } = abandonPasséEnInstruction.payload;

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        Demande d'abandon passée en instruction{' '}
        <TimelineItemUserEmail email={passéEnInstructionPar} />
      </div>
    ),
  };
};
