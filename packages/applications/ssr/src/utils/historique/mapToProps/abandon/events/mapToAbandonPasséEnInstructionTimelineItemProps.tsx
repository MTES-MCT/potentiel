import { Lauréat } from '@potentiel-domain/projet';

import { MapToAbandonEventTimelineItemProps } from '../mapToAbandonTimelineItemProps';

export const mapToAbandonPasséEnInstructionTimelineItemProps: MapToAbandonEventTimelineItemProps = (
  abandonPasséEnInstruction,
  icon,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    abandonPasséEnInstruction.payload as Lauréat.Abandon.AbandonPasséEnInstructionEvent['payload'];

  return {
    date: passéEnInstructionLe,
    icon,
    title: (
      <div>
        Demande d'abandon passée en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};
