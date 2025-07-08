import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonAnnuléTimelineItemProps = (
  abandonAnnulé: Lauréat.Abandon.AbandonAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = abandonAnnulé.payload;

  return {
    date: annuléLe,
    title: (
      <div>Demande d'abandon annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};
