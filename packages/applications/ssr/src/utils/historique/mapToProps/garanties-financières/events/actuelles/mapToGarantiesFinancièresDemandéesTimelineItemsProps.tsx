import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresDemandéesTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent,
) => {
  const { demandéLe, dateLimiteSoumission, motif } = modification.payload;

  return {
    date: demandéLe,
    title: (
      <div>
        Garanties financières demandées au porteur par le{' '}
        <span className="font-semibold">système</span>
      </div>
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
