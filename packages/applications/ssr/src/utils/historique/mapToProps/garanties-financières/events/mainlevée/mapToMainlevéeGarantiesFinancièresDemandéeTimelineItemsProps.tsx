import { Lauréat } from '@potentiel-domain/projet';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, demandéPar, motif } =
    modification.payload as Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent['payload'];

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
