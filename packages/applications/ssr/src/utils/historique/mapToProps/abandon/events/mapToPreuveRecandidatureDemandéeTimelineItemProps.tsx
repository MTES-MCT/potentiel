import { Lauréat } from '@potentiel-domain/projet';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps = (
  preuveRecandidatureDemandée: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent,
) => {
  const { demandéeLe } = preuveRecandidatureDemandée.payload;

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
