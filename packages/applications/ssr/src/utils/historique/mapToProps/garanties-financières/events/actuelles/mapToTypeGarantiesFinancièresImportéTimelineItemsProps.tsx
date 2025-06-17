import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToTypeGarantiesFinancièresImportéTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { importéLe, type, dateÉchéance } =
      modification.payload as GarantiesFinancières.TypeGarantiesFinancièresImportéEvent['payload'];

    return {
      date: importéLe,
      icon,
      title: <div>Type de garanties financières importé</div>,
      content: (
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
