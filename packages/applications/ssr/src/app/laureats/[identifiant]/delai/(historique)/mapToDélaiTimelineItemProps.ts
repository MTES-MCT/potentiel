import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import {
  mapToDemandeDélaiAnnuléeTimelineItemProps,
  mapToDemandeDélaiCorrigéeTimelineItemProps,
  mapToDemandeDélaiPasséeEnInstructionTimelineItemProps,
  mapToDemandeDélaiRejetéeTimelineItemProps,
  mapToDélaiAccordéTimelineItemProps,
  mapToDélaiDemandéTimelineItemProps,
} from './events';
import { mapToDemandeDélaiSuppriméeTimelineItemProps } from './events/mapToDemandeDélaiSuppriméeTimelineItemProps';

export const mapToDélaiTimelineItemProps = (
  event: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
  permissionConsulterChangement: boolean,
) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'DélaiDemandé-V1',
      },
      (event) => mapToDélaiDemandéTimelineItemProps(event, permissionConsulterChangement),
    )
    .with(
      {
        type: 'DemandeDélaiAnnulée-V1',
      },
      mapToDemandeDélaiAnnuléeTimelineItemProps,
    )
    .with(
      {
        type: 'DemandeDélaiPasséeEnInstruction-V1',
      },
      mapToDemandeDélaiPasséeEnInstructionTimelineItemProps,
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
    .with(
      {
        type: 'DemandeDélaiCorrigée-V1',
      },
      mapToDemandeDélaiCorrigéeTimelineItemProps,
    )
    .with(
      {
        type: 'DemandeDélaiSupprimée-V1',
      },
      mapToDemandeDélaiSuppriméeTimelineItemProps,
    )
    .exhaustive();
