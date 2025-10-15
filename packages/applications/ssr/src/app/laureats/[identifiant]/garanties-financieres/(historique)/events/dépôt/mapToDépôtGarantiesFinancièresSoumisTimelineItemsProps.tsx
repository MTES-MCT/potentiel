import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
) => {
  const { type, dateÉchéance, dateConstitution, soumisLe, soumisPar } = modification.payload;

  return {
    date: soumisLe,
    title: (
      <div>
        Nouvelles garanties financières (soumises à instruction) déposées par{' '}
        <span className="font-semibold">{soumisPar}</span>
      </div>
    ),
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
