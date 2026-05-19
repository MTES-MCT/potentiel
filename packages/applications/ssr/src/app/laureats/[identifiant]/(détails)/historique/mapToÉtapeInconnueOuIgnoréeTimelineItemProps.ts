import type { DateTime } from '@potentiel-domain/common';
import type { HistoryRecord } from '@potentiel-domain/entity';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToÉtapeInconnueOuIgnoréeTimelineItemProps = (
  event: HistoryRecord,
): TimelineItemProps => ({
  isÉtapeInconnue: true,
  title: 'Étape inconnue',
  type: event.type,
  icon: { id: 'ri-question-line' },
  date: event.createdAt as DateTime.RawType,
});
