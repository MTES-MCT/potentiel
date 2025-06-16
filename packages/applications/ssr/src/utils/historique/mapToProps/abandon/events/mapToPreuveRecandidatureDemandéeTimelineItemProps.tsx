import { Lauréat } from '@potentiel-domain/projet';

import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps: MapToEventTimelineItemsProps = (
  preuveRecandidatureDemandée,
  icon,
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Lauréat.Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    icon,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
