import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps = (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const { validéLe, validéPar } = event.payload;

  return {
    date: validéLe,
    title: (
      <div>
        Les nouvelles garanties financières (soumise à instruction) ont été validées{' '}
        <TimelineItemUserEmail email={validéPar} />
      </div>
    ),
  };
};
