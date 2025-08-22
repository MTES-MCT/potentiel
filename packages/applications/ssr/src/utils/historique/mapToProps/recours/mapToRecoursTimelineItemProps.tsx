import { match } from 'ts-pattern';

import type { Éliminé } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import {
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursDemandéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
  mapToRecoursRejetéTimelineItemProps,
} from './events';

export const mapToRecoursTimelineItemProps = (
  record: Éliminé.Recours.HistoriqueRecoursProjetListItemReadModel,
) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'RecoursDemandé-V1',
      },
      mapToRecoursDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursAnnulé-V1',
      },
      mapToRecoursAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursAccordé-V1',
      },
      mapToRecoursAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursRejeté-V1',
      },
      mapToRecoursRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursPasséEnInstruction-V1',
      },
      mapToRecoursPasséEnInstructionTimelineItemProp,
    )
    .exhaustive();
