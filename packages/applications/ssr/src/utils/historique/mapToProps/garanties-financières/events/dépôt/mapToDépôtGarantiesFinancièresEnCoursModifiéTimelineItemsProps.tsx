import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { type, dateÉchéance, dateConstitution, modifiéLe, modifiéPar } =
      modification.payload as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent['payload'];

    return {
      date: modifiéLe,
      icon,
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
