import { DateTime } from '@potentiel-domain/common';

import { ETAPE_IGNORÉE_TITLE } from '@/components/organisms/timeline/Timeline';

import { HistoriqueItem } from '../HistoriqueItem.type';

export const mapToÉtapeIgnoréeTimelineItemProps: HistoriqueItem<unknown> = () => ({
  title: ETAPE_IGNORÉE_TITLE,
  type: 'étape-ignorée',
  icon: {
    id: 'ri-question-line',
  },
  date: DateTime.now().formatter(),
});
