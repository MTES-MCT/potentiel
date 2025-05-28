import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToPreuveRecandidatureDemandéeTimelineItemProps = (
  preuveRecandidatureDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéeLe } =
    preuveRecandidatureDemandée.payload as Lauréat.Abandon.PreuveRecandidatureDemandéeEvent['payload'];

  return {
    date: demandéeLe,
    title: <div>Preuve de recandidature demandée</div>,
  };
};
