import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToTypeGarantiesFinancièresImportéTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent,
) => {
  const { importéLe, type, dateÉchéance } = modification.payload;

  return {
    date: importéLe,
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
