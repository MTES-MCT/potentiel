import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRaccordementDésactivéTimelineItemProps = (
  event: Lauréat.Raccordement.RaccordementDésactivéEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: 'Le raccordement du projet a été désactivé',
});
