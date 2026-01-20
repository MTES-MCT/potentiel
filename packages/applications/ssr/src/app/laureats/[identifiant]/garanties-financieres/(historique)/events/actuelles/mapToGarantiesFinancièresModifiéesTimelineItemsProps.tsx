import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { GarantiesFinancièresTimelineItemContent } from '../../GarantiesFinancièresTimelineItemContent';

export const mapToGarantiesFinancièresModifiéesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent,
): TimelineItemProps => {
  const { dateConstitution, type, dateÉchéance, modifiéLe, modifiéPar } = event.payload;

  return {
    date: modifiéLe,
    title: 'Garanties financières modifiées',
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
