import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToDélaiAccordéTimelineItemProps } from './events/mapToDélaiAccordéTimelineItemProps';
import { mapToDemandeDélaiAnnuléeTimelineItemProps } from './events/mapToDemandeDélaiAnnuléeTimelineItemProps';
import { mapToDélaiDemandéTimelineItemProps } from './events/mapToDélaiDemandéTimelineItemProps';
import { mapToDemandeDélaiRejetéeTimelineItemProps } from './events/mapToDemandeDélaiRejetéeTimelineItemProps';

export const mapToDélaiTimelineItemProps = (
  readmodel: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'DélaiDemandé-V1',
      },
      mapToDélaiDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'DemandeDélaiAnnulée-V1',
      },
      mapToDemandeDélaiAnnuléeTimelineItemProps,
    )
    .with(
      {
        type: 'DemandeDélaiRejetée-V1',
      },
      mapToDemandeDélaiRejetéeTimelineItemProps,
    )
    .with(
      {
        type: 'DélaiAccordé-V1',
      },
      mapToDélaiAccordéTimelineItemProps,
    )
    .exhaustive();
