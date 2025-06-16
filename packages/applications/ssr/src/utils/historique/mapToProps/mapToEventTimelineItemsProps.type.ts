import { Historique } from '@potentiel-domain/historique';

import { IconProps } from '@/components/atoms/Icon';
import { TimelineItemProps } from '@/components/organisms/Timeline';

export type MapToEventTimelineItemsProps = (
  event: Historique.ListerHistoriqueProjetReadModel['items'][number],
  icon: IconProps,
) => TimelineItemProps;
