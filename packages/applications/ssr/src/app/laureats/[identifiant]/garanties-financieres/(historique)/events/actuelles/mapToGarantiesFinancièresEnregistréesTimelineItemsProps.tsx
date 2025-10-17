import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGarantiesFinancièresEnregistréesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, type, dateÉchéance, dateConstitution } = event.payload;

  return {
    date: enregistréLe,
    title: 'Garanties financières enregistrées',
    acteur: enregistréPar,
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
