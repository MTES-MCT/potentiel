import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

import { getGarantiesFinancièresMotifLabel } from '../../../_helpers/getGarantiesFinancièresMotifLabel';

export const mapToGarantiesFinancièresDemandéesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent,
): TimelineItemProps => {
  const { demandéLe, dateLimiteSoumission, motif } = event.payload;

  return {
    date: demandéLe,
    title: 'Garanties financières demandées au porteur',
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Date limite de soumission :{' '}
          <span className="font-semibold">
            <FormattedDate date={dateLimiteSoumission} />
          </span>
        </div>
        <div>
          Motif de la demande :{' '}
          <span className="font-semibold">{getGarantiesFinancièresMotifLabel(motif)}</span>
        </div>
      </div>
    ),
  };
};
