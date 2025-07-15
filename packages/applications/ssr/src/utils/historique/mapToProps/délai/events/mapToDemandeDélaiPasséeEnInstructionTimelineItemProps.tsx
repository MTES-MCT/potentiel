import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiPasséeEnInstructionTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent,
) => {
  const { passéeEnInstructionLe, passéeEnInstructionPar } = record.payload;

  return {
    date: passéeEnInstructionLe,
    title: (
      <div>
        Demande de délai passée en instruction par{' '}
        {<span className="font-semibold">{passéeEnInstructionPar}</span>}
      </div>
    ),
  };
};
