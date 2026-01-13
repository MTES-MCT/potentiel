import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent,
): TimelineItemProps => {
  const { demandéLe, demandéPar, motif } = event.payload;

  return {
    date: demandéLe,
    title: 'La mainlevée des garanties financières a été demandée',
    actor: demandéPar,
    details: (
      <div>
        Motif : <span className="font-semibold">{motif}</span>
      </div>
    ),
  };
};
