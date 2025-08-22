import type { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonPasséEnInstructionTimelineItemProps = (
  abandonPasséEnInstruction: Lauréat.Abandon.AbandonPasséEnInstructionEvent,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } = abandonPasséEnInstruction.payload;

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        Demande d'abandon passée en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};
