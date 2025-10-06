import { Lauréat } from '@potentiel-domain/projet';

import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.PreuveRecandidatureDemandéeEvent
> = ({ event }) => {
  const { demandéeLe } = event.payload;

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
