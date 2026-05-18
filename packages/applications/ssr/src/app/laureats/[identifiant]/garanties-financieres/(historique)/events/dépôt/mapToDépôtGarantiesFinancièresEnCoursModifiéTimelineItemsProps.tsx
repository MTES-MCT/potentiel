import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { GarantiesFinancièresTimelineItemContent } from '../../GarantiesFinancièresTimelineItemContent';

export const mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent,
): TimelineItemProps => {
  const { type, dateÉchéance, dateConstitution, modifiéLe, modifiéPar } = event.payload;

  return {
    date: modifiéLe,
    title: 'Nouvelles garanties financières (soumise à instruction modifiées)',
    actor: modifiéPar,
    details: (
      <GarantiesFinancièresTimelineItemContent
        type={type}
        dateConstitution={dateConstitution}
        dateÉchéance={dateÉchéance}
      />
    ),
  };
};
