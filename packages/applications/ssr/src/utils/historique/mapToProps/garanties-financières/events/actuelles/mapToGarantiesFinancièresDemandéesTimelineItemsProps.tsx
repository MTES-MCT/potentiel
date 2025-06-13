import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresDemandéesTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, dateLimiteSoumission, motif } =
    modification.payload as GarantiesFinancières.GarantiesFinancièresDemandéesEvent['payload'];

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
