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

export const mapToDélaiTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel;
  isHistoriqueProjet?: true;
}) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'DélaiDemandé-V1',
      },
      (event) => mapToDélaiDemandéTimelineItemProps({ event, isHistoriqueProjet }),
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
