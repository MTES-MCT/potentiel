import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToDemandeDélaiAnnuléeTimelineItemProps,
  mapToDemandeDélaiCorrigéeTimelineItemProps,
  mapToDemandeDélaiPasséeEnInstructionTimelineItemProps,
  mapToDemandeDélaiRejetéeTimelineItemProps,
  mapToDélaiAccordéTimelineItemProps,
  mapToDélaiDemandéTimelineItemProps,
} from './events';
import { mapToDemandeDélaiSuppriméeTimelineItemProps } from './events/mapToDemandeDélaiSuppriméeTimelineItemProps';

type MapToDélaiTimelineItemProps = (
  readmodel: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
) => TimelineItemProps;

export const mapToDélaiTimelineItemProps: MapToDélaiTimelineItemProps = (readmodel) =>
  match(readmodel)
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
