import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps = (
  preuveRecandidatureDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
