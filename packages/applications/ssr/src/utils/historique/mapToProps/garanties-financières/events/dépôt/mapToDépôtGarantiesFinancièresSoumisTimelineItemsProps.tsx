import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { type, dateÉchéance, dateConstitution, soumisLe, soumisPar } =
      modification.payload as GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent['payload'];

    return {
      date: soumisLe,
      icon,
      title: (
        <div>
          Nouvelles garanties financières (soumise à instruction) déposées par{' '}
          <span className="font-semibold">{soumisPar}</span>
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
