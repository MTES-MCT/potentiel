import { match, P } from 'ts-pattern';

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
        type: P.union('DélaiDemandé-V1', 'DélaiDemandé-V2'),
      },
      (event) => mapToDélaiDemandéTimelineItemProps(event, permissionConsulterChangement),
    )
    .with(
      {
        type: P.union('DemandeDélaiAnnulée-V1', 'DemandeDélaiAnnulée-V2'),
      },
      mapToDemandeDélaiAnnuléeTimelineItemProps,
    )
    .with(
      {
        type: P.union('DemandeDélaiPasséeEnInstruction-V1', 'DemandeDélaiPasséeEnInstruction-V2'),
      },
      mapToDemandeDélaiPasséeEnInstructionTimelineItemProps,
    )
    .with(
      {
        type: P.union('DemandeDélaiRejetée-V1', 'DemandeDélaiRejetée-V2'),
      },
      mapToDemandeDélaiRejetéeTimelineItemProps,
    )
    .with(
      {
        type: P.union('DélaiAccordé-V1', 'DélaiAccordé-V2'),
      },
      mapToDélaiAccordéTimelineItemProps,
    )
    .with(
      {
        type: P.union('DemandeDélaiCorrigée-V1', 'DemandeDélaiCorrigée-V2'),
      },
      mapToDemandeDélaiCorrigéeTimelineItemProps,
    )
    .with(
      {
        type: P.union('DemandeDélaiSupprimée-V1', 'DemandeDélaiSupprimée-V2'),
      },
      mapToDemandeDélaiSuppriméeTimelineItemProps,
    )
    .exhaustive();
