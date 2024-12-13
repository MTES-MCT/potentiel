import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToRecoursDemandéTimelineItemProps } from './mapToRecoursDemandéTimelineItemProps';
import { mapToRecoursAnnuléTimelineItemProps } from './mapToRecoursAnnuléTimelineItemProps';
import { mapToRecoursRejetéTimelineItemProps } from './mapToRecoursRejetéTimelineItemProps';
import { mapToRecoursAccordéTimelineItemProps } from './mapToRecoursAccordéTimelineItemProps';

export const mapToRecoursTimelineItemProps = (record: HistoryRecord) => {
  return match(record)
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
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};
