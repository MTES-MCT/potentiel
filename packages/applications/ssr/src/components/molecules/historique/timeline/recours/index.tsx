import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToRecoursDemandéTimelineItemProps } from './mapToRecoursDemandéTimelineItemProps';
import { mapToRecoursAnnuléTimelineItemProps } from './mapToRecoursAnnuléTimelineItemProps';
import { mapToRecoursRejetéTimelineItemProps } from './mapToRecoursRejetéTimelineItemProps';
import { mapToRecoursAccordéTimelineItemProps } from './mapToRecoursAccordéTimelineItemProps';
import { mapToRecoursPasséEnInstructionTimelineItemProp } from './mapToRecoursPasséEnInstructionTimelineItemProps';

export const mapToRecoursTimelineItemProps = (record: Historique.RecoursHistoryRecord) =>
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
