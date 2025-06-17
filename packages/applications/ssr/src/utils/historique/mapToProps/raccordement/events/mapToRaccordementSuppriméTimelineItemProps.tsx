import { DateTime } from '@potentiel-domain/common';

import { MapToRaccordementTimelineItemProps } from '../mapToRaccordementTimelineItemProps';

export const mapToRacordementSuppriméTimelineItemProps: MapToRaccordementTimelineItemProps = (
  modification,
  icon,
) => ({
  date: modification.createdAt as DateTime.RawType,
  icon,
  title: <div>Le raccordement du projet a été supprimé</div>,
});
