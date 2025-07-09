import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonConfirméTimelineItemProps = (
  abandonConfirmé: Lauréat.Abandon.AbandonConfirméEvent,
) => {
  const { confirméLe, confirméPar } = abandonConfirmé.payload;

  return {
    date: confirméLe,
    title: (
      <div>
        Demande d'abandon confirmée par {<span className="font-semibold">{confirméPar}</span>}
      </div>
    ),
  };
};
