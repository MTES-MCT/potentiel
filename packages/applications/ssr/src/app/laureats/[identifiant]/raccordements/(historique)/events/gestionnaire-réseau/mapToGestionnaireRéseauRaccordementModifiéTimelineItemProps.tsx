import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToGestionnaireRéseauRaccordementModifiéTimelineItemProps = (
  event: Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEvent & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: 'Nouveau gestionnaire de réseau de raccordement enregistré',
});
