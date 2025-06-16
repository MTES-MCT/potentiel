import { match } from 'ts-pattern';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (dépôtSupprimé, icon) => {
    const event = match(dépôtSupprimé)
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1' },
        (event) =>
          event as unknown as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2' },
        (event) =>
          event as unknown as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
      )
      .otherwise(() => undefined);

    if (!event) {
      return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(dépôtSupprimé);
    }

    const { suppriméLe, suppriméPar } = event.payload;

    return {
      date: suppriméLe,
      icon,
      title: (
        <div>
          Les nouvelles garanties financières (soumise à instruction) ont été supprimées par{' '}
          <span className="font-semibold">{suppriméPar}</span>
        </div>
      ),
    };
  };
