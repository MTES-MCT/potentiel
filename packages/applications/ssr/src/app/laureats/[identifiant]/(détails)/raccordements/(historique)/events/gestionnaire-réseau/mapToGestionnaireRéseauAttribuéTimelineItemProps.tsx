import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGestionnaireRéseauAttribuéTimelineItemProps = (
  event: Lauréat.Raccordement.GestionnaireRéseauAttribuéEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: 'Un gestionnaire de réseau de raccordement a été attribué au raccordement du projet',
});
