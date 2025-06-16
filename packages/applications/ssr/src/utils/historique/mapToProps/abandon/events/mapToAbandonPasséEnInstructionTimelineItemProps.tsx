import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonPasséEnInstructionTimelineItemProps = (
  abandonPasséEnInstruction: Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    abandonPasséEnInstruction.payload as Lauréat.Abandon.AbandonPasséEnInstructionEvent['payload'];

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
