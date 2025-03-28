import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToRecoursDemandéTimelineItemProps } from './mapToRecoursDemandéTimelineItemProps';
import { mapToRecoursAnnuléTimelineItemProps } from './mapToRecoursAnnuléTimelineItemProps';
import { mapToRecoursRejetéTimelineItemProps } from './mapToRecoursRejetéTimelineItemProps';
import { mapToRecoursAccordéTimelineItemProps } from './mapToRecoursAccordéTimelineItemProps';
import { mapToRecoursPasséEnInstructionTimelineItemProp } from './mapToRecoursPasséEnInstructionTimelineItemProps';

export const mapToRecoursTimelineItemProps = (record: HistoryRecord) =>
  match(
    record as HistoryRecord<
      Éliminé.Recours.RecoursEvent['type'],
      Éliminé.Recours.RecoursEvent['payload']
    >,
  )
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
