import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

export const mapToAbandonConfirméTimelineItemProps = (
  abandonConfirmé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { confirméLe, confirméPar } =
    abandonConfirmé.payload as Abandon.AbandonConfirméEvent['payload'];

  return {
    date: confirméLe,
    title: <div>Abandon confirmé par {<span className="font-semibold">{confirméPar}</span>}</div>,
  };
};
