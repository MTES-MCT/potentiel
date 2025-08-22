import type { DateTime } from '@potentiel-domain/common';
import type { HistoryRecord } from '@potentiel-domain/entity';

import type { IconProps } from '@/components/atoms/Icon';
import { ETAPE_INCONNUE_TITLE, type TimelineItemProps } from '@/components/organisms/Timeline';

export const mapToÉtapeInconnueOuIgnoréeTimelineItemProps = (
  record: HistoryRecord,
): TimelineItemProps => {
  const icon: IconProps = {
    id: 'ri-question-line',
  };

  return {
    title: ETAPE_INCONNUE_TITLE,
    type: record.type,
    icon,
    date: record.createdAt as DateTime.RawType,
  };
};
