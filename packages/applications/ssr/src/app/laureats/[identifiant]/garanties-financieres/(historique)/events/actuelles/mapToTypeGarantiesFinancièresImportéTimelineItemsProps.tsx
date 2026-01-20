import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToTypeGarantiesFinancièresImportéTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent,
): TimelineItemProps => {
  const { importéLe, type, dateÉchéance } = event.payload;

  return {
    date: importéLe,
    title: 'Type de garanties financières importé',
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{type}</span>
        </div>
        {dateÉchéance && (
          <div>
            Date d'échéance : <FormattedDate date={dateÉchéance} />
          </div>
        )}
      </div>
    ),
  };
};
