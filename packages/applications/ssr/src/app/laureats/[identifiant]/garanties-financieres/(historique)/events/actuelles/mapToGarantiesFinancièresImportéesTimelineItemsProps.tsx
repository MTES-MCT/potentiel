import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { GarantiesFinancièresTimelineItemContent } from '../../GarantiesFinancièresTimelineItemContent';

export const mapToGarantiesFinancièresImportéesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresImportéesEvent,
): TimelineItemProps => {
  const { importéLe, type, dateÉchéance, dateConstitution } = event.payload;

  return {
    date: importéLe,
    title: 'Garanties financières importées',
    content: (
      <GarantiesFinancièresTimelineItemContent
        type={type}
        dateConstitution={dateConstitution}
        dateÉchéance={dateÉchéance}
      />
    ),
  };
};
