import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToDemandeDélaiAnnuléeTimelineItemProps,
  mapToDemandeDélaiCorrigéeTimelineItemProps,
  mapToDemandeDélaiPasséeEnInstructionTimelineItemProps,
  mapToDemandeDélaiRejetéeTimelineItemProps,
  mapToDélaiAccordéTimelineItemProps,
  mapToDélaiDemandéTimelineItemProps,
  mapToLegacyDélaiAccordéTimelineItemProps,
} from './events';

export const mapToDélaiTimelineItemProps = (
  readmodel: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps | undefined>()
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
        type: 'LegacyDélaiAccordé-V1',
      },
      mapToLegacyDélaiAccordéTimelineItemProps,
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
      () => undefined,
    )
    .exhaustive();
