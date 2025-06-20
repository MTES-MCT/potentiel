import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresModifiéesTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { dateConstitution, type, dateÉchéance, modifiéLe, modifiéPar } =
    modification.payload as Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent['payload'];

  return {
    date: modifiéLe,
    title: (
      <div>
        Garanties financières modifiées par <span className="font-semibold">{modifiéPar}</span>
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
