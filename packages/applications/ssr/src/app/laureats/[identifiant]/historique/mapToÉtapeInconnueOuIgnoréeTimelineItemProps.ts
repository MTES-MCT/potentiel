import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps, ETAPE_INCONNUE_TITLE } from '@/components/organisms/timeline';
import { IconProps } from '@/components/atoms/Icon';

export const mapToÉtapeInconnueOuIgnoréeTimelineItemProps = (
  event: HistoryRecord,
): TimelineItemProps => {
  const icon: IconProps = {
    id: 'ri-question-line',
  };

  return {
    title: ETAPE_INCONNUE_TITLE,
    type: event.type,
    icon,
    date: event.createdAt as DateTime.RawType,
  };
};
