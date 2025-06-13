import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToHistoriqueGarantiesFinancièresEffacéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { effacéLe, effacéPar } =
    modification.payload as Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent['payload'];

  return {
    date: effacéLe,
    title: (
      <div>
        Toutes les garanties financières ont été supprimées par{' '}
        <span className="font-semibold">{effacéPar}</span>{' '}
      </div>
    ),
  };
};
