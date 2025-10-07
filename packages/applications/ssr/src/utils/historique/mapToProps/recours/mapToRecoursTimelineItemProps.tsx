import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline/TimelineItem';

import {
  mapToRecoursDemandéTimelineItemProps,
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursRejetéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
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
