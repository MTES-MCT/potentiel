import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

export const mapToAbandonPasséEnInstructionTimelineItemProps = (
  abandonPasséEnInstruction: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    abandonPasséEnInstruction.payload as Abandon.AbandonPasséEnInstructionEvent['payload'];

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        Abandon passé en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};
