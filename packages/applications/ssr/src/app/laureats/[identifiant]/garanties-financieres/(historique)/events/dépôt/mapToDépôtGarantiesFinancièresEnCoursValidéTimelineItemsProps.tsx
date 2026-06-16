import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps = (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
): TimelineItemProps => {
  const { validéLe, validéPar } = event.payload;

  return {
    date: validéLe,
    title: 'Les nouvelles garanties financières (soumises à instruction) ont été validées',
    actor: validéPar,
  };
};
