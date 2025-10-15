import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeDélaiPasséeEnInstructionTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent,
) => {
  const { passéeEnInstructionLe, passéeEnInstructionPar } = record.payload;

  return {
    date: passéeEnInstructionLe,
    title: (
      <div>
        Demande de délai passée en instruction{' '}
        <TimelineItemUserEmail email={passéeEnInstructionPar} />
      </div>
    ),
  };
};
