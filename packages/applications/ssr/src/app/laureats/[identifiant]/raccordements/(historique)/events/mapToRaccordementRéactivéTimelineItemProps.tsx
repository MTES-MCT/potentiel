import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRaccordementRéactivéTimelineItemProps = (
  event: Lauréat.Raccordement.RaccordementRéactivéEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: `Le raccordement du projet a été réactivé${event.payload.raison === 'PPA-signalé' ? "suite au signalement d'un PPA" : ''}.`,
});
