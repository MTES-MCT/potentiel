import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRaccordementSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.RaccordementSuppriméEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: 'Le raccordement du projet a été supprimé',
});
