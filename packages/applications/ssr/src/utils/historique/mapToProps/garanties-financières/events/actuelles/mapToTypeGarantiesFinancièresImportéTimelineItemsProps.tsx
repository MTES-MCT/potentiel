import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToTypeGarantiesFinancièresImportéTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, type, dateÉchéance } =
    modification.payload as GarantiesFinancières.TypeGarantiesFinancièresImportéEvent['payload'];

  return {
    date: importéLe,
    title: <div>Type de aranties financières importé</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{type}</span>
        </div>
        {dateÉchéance && (
          <div>
            Date d'échéance : <FormattedDate date={dateÉchéance} />
          </div>
        )}
      </div>
    ),
  };
};
