import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToGarantiesFinancièresModifiéesTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { dateConstitution, type, dateÉchéance, modifiéLe, modifiéPar } =
      modification.payload as Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent['payload'];

    return {
      date: modifiéLe,
      icon,
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
            {<FormattedDate date={dateConstitution} className="font-semibold" />}
          </div>
        </div>
      ),
    };
  };
