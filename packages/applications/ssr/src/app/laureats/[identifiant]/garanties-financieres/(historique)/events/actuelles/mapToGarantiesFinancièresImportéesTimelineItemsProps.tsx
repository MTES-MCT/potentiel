import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresImportéesTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.GarantiesFinancièresImportéesEvent,
) => {
  const { importéLe, type, dateÉchéance, dateConstitution } = modification.payload;

  return {
    date: importéLe,
    title: <div>Garanties financières importées</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{type}</span>
        </div>
        {dateÉchéance && (
          <div>
            Date d'échéance :{' '}
            <span className="font-semibold">{<FormattedDate date={dateÉchéance} />}</span>
          </div>
        )}
        <div>
          Date de constitution :{' '}
          <span className="font-semibold">{<FormattedDate date={dateConstitution} />}</span>
        </div>
      </div>
    ),
  };
};
