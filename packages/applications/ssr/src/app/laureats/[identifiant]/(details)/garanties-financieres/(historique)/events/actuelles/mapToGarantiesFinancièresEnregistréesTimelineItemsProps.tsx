import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { GarantiesFinancièresTimelineItemContent } from '../../GarantiesFinancièresTimelineItemContent';

export const mapToGarantiesFinancièresEnregistréesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, type, dateÉchéance, dateConstitution } = event.payload;

  return {
    date: enregistréLe,
    title: 'Garanties financières enregistrées',
    actor: enregistréPar,
    details: (
      <GarantiesFinancièresTimelineItemContent
        type={type}
        dateConstitution={dateConstitution}
        dateÉchéance={dateÉchéance}
      />
    ),
  };
};
