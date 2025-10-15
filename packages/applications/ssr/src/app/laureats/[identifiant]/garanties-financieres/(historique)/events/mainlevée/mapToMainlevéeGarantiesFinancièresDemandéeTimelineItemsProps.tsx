import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent,
) => {
  const { demandéLe, demandéPar, motif } = modification.payload;

  return {
    date: demandéLe,
    title: (
      <div>
        La mainlevée des garanties financières a été demandée{' '}
        <TimelineItemUserEmail email={demandéPar} />
      </div>
    ),
    content: (
      <div>
        Motif : <span className="font-semibold">{motif}</span>
      </div>
    ),
  };
};
