import { Lauréat } from '@potentiel-domain/projet';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps = (
  preuveRecandidatureDemandée: Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel,
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Lauréat.Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
