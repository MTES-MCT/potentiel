import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

export const mapToAbandonAnnuléTimelineItemProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } = abandonAnnulé.payload as Abandon.AbandonAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: <div>Abandon annulé par {<span className="font-semibold">{annuléPar}</span>}</div>,
  };
};
