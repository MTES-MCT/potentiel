import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (dépôtValidé, icon) => {
    const event = match(dépôtValidé)
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' },
        (event) =>
          event as unknown as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1,
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' },
        (event) =>
          event as unknown as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
      )
      .otherwise(() => undefined);

    if (!event) {
      return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(dépôtValidé);
    }

    const { validéLe, validéPar } = event.payload;

    return {
      date: validéLe,
      icon,
      title: (
        <div>
          Les nouvelles garanties financières (soumise à instruction) ont été validées par{' '}
          <span className="font-semibold">{validéPar}</span>
        </div>
      ),
    };
  };
