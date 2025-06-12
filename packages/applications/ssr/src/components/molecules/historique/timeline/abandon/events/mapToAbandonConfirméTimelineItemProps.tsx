import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonConfirméTimelineItemProps = (
  abandonConfirmé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { confirméLe, confirméPar } =
    abandonConfirmé.payload as Lauréat.Abandon.AbandonConfirméEvent['payload'];

  return {
    date: confirméLe,
    title: (
      <div>
        Demande d'abandon confirmée par {<span className="font-semibold">{confirméPar}</span>}
      </div>
    ),
  };
};
