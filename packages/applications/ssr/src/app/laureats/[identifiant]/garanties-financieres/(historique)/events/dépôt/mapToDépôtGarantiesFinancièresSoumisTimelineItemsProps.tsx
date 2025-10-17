import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
): TimelineItemProps => {
  const { type, dateÉchéance, dateConstitution, soumisLe, soumisPar } = event.payload;

  return {
    date: soumisLe,
    title: 'Nouvelles garanties financières (soumises à instruction) déposées',
    acteur: soumisPar,
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
