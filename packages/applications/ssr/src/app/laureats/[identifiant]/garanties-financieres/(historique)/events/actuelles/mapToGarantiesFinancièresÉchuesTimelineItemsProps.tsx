import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGarantiesFinancièresÉchuesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent,
): TimelineItemProps => {
  const { échuLe, dateÉchéance } = event.payload;

  return {
    date: échuLe,
    title: 'Les garanties financières sont arrivées à échéance',
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Date d'échéance dépassée : <FormattedDate date={dateÉchéance} className="font-semibold" />
        </div>
      </div>
    ),
  };
};
