import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, demandéPar, motif } =
    modification.payload as GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent['payload'];

  return {
    date: demandéLe,
    title: (
      <div>
        La mainlevée des garanties financières a été demandée par{' '}
        <span className="font-semibold">{demandéPar}</span>{' '}
      </div>
    ),
    content: (
      <div>
        Motif : <span className="font-semibold">{motif}</span>
      </div>
    ),
  };
};
