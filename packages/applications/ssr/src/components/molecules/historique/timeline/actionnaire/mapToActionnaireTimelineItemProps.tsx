import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementActionnaireAccordéTimelineItemProps } from './mapToChangementActionnaireAccordéTimelineItemProps';
import { mapToModificationActionnaireTimelineItemProps } from './mapToModificationActionnaireTimelineItemsProps';

export const mapToActionnaireTimelineItemProps = (record: HistoryRecord) => {
  return match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ActionnaireModifié-V1',
      },
      mapToModificationActionnaireTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireAccordé-V1',
      },
      mapToChangementActionnaireAccordéTimelineItemProps,
    )
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};
