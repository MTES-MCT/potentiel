import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { type, dateÉchéance, dateConstitution, modifiéLe, modifiéPar } =
    modification.payload as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent['payload'];

  return {
    date: modifiéLe,
    title: (
      <div>
        Nouvelles garanties financières (soumise à instruction modifiées) par{' '}
        <span className="font-semibold">{modifiéPar}</span>
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{type}</span>
        </div>
        {dateÉchéance && (
          <div>
            Date d'échéance :{' '}
            <span className="font-semibold">{<FormattedDate date={dateÉchéance} />}</span>
          </div>
        )}
        <div>
          Date de constitution :{' '}
          <span className="font-semibold">{<FormattedDate date={dateConstitution} />}</span>
        </div>
      </div>
    ),
  };
};
