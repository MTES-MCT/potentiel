import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

export const mapToÉtapeInconnueOuIgnoréeTimelineItemProps = (
  record: HistoryRecord,
): TimelineItemProps => {
  const icon: IconProps = {
    id: 'ri-question-line',
  };

  return {
    title: `Étape inconnue`,
    type: record.type,
    icon,
    date: record.createdAt as DateTime.RawType,
  };
};
