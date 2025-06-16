import { Lauréat } from '@potentiel-domain/projet';

import { MapToAbandonTimelineItemProps } from '../mapToAbandonTimelineItemProps';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps: MapToAbandonTimelineItemProps = (
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
