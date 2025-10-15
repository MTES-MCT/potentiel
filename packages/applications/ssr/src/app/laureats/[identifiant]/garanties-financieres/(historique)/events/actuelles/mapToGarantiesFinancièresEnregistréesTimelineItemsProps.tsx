import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToGarantiesFinancièresEnregistréesTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent,
) => {
  const { enregistréLe, enregistréPar, type, dateÉchéance, dateConstitution } =
    modification.payload;

  return {
    date: enregistréLe,
    title: (
      <div>
        Garanties financières enregistrées <TimelineItemUserEmail email={enregistréPar} />
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
