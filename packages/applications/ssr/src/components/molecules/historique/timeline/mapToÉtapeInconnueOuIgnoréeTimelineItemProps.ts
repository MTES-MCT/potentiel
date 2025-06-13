import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/Timeline';

export const mapToÉtapeInconnueOuIgnoréeTimelineItemProps = (
  record: HistoryRecord,
): TimelineItemProps => ({
  title: `Étape inconnue`,
  type: record.type,
  date: record.createdAt as DateTime.RawType,
});
