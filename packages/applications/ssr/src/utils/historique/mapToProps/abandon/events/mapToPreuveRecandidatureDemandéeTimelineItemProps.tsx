import { Lauréat } from '@potentiel-domain/projet';

import { MapToAbandonEventTimelineItemProps } from '../mapToAbandonTimelineItemProps';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps: MapToAbandonEventTimelineItemProps =
  (preuveRecandidatureDemandée, icon) => {
    const { demandéeLe } =
      preuveRecandidatureDemandée.payload as Lauréat.Abandon.PreuveRecandidatureDemandéeEvent['payload'];

    return {
      date: demandéeLe,
      icon,
      title: <div>Preuve de recandidature demandée</div>,
    };
  };
