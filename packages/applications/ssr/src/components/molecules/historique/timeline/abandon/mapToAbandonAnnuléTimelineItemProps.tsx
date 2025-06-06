import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToAbandonAnnuléTimelineItemProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    abandonAnnulé.payload as Lauréat.Abandon.AbandonAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>Demande d'abandon annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};
