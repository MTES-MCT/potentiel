import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToGarantiesFinancièresÉchuesTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { échuLe, dateÉchéance } =
      modification.payload as GarantiesFinancières.GarantiesFinancièresÉchuesEvent['payload'];

    return {
      date: échuLe,
      icon,
      title: <div>Les garanties financières sont arrivées à échéance</div>,
      content: (
        <div className="flex flex-col gap-2">
          <div>
            Date d'échéance dépassée :{' '}
            <FormattedDate date={dateÉchéance} className="font-semibold" />
          </div>
        </div>
      ),
    };
  };
