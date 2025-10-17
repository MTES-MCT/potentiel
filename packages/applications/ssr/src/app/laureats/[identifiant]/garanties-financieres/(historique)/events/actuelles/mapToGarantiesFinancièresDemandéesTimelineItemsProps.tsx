import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGarantiesFinancièresDemandéesTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent,
): TimelineItemProps => {
  const { demandéLe, dateLimiteSoumission, motif } = event.payload;

  return {
    date: demandéLe,
    title: (
      <>
        Garanties financières demandées au porteur par le{' '}
        <span className="font-semibold">système</span>
      </>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Date limite de soumission :{' '}
          <span className="font-semibold">
            <FormattedDate date={dateLimiteSoumission} />
          </span>
        </div>
        <div>
          Motif de la demande : <span className="font-semibold">{motif}</span>
        </div>
      </div>
    ),
  };
};
