import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToDélaiAccordéTimelineItemProps } from './events/mapToDélaiAccordéTimelineItemProps';
import { mapToDemandeDélaiAnnuléeTimelineItemProps } from './events/mapToDemandeDélaiAnnuléeTimelineItemProps';

export const mapToDélaiTimelineItemProps = (
  readmodel: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with(
      {
        type: 'DélaiDemandé-V1',
      },
      mapToDélaiTimelineItemProps,
    )
    .with(
      {
        type: 'DemandeDélaiAnnulée-V1',
      },
      mapToDemandeDélaiAnnuléeTimelineItemProps,
    )
    .with(
      {
        type: 'DélaiAccordé-V1',
      },
      mapToDélaiAccordéTimelineItemProps,
    )
    .exhaustive();
