import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRaccordementSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.RaccordementSuppriméEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: 'Le raccordement du projet a été supprimé',
});
