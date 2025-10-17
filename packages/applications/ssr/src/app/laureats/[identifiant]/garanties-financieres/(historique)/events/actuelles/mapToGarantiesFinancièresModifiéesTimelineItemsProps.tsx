import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGarantiesFinancièresModifiéesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent,
): TimelineItemProps => {
  const { dateConstitution, type, dateÉchéance, modifiéLe, modifiéPar } = event.payload;

  return {
    date: modifiéLe,
    title: 'Garanties financières modifiées',
    acteur: modifiéPar,
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
