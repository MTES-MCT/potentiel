import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { GarantiesFinancièresTimelineItemContent } from '../../GarantiesFinancièresTimelineItemContent';

export const mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
): TimelineItemProps => {
  const { type, dateÉchéance, dateConstitution, soumisLe, soumisPar } = event.payload;

  return {
    date: soumisLe,
    title: 'Nouvelles garanties financières (soumises à instruction) déposées',
    actor: soumisPar,
    details: (
      <GarantiesFinancièresTimelineItemContent
        type={type}
        dateConstitution={dateConstitution}
        dateÉchéance={dateÉchéance}
      />
    ),
  };
};
