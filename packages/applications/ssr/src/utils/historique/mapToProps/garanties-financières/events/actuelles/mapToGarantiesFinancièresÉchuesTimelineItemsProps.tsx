import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresÉchuesTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { échuLe, dateÉchéance } =
    modification.payload as GarantiesFinancières.GarantiesFinancièresÉchuesEvent['payload'];

  return {
    date: échuLe,
    title: <div>Les garanties financières sont arrivées à échéance</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Date d'échéance dépassée : <FormattedDate date={dateÉchéance} className="font-semibold" />
        </div>
      </div>
    ),
  };
};
