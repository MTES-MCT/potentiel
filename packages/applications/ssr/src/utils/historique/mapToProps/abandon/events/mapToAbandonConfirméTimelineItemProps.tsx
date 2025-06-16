import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonConfirméTimelineItemProps = (
  abandonConfirmé: Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel,
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
