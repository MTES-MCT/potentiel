import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiPasséeEnInstructionTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } = record.payload;

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        Demande de délai passée en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};
