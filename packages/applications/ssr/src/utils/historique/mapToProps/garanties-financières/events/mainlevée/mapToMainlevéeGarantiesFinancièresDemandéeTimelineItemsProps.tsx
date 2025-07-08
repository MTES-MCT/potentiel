import { Lauréat } from '@potentiel-domain/projet';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent,
) => {
  const { demandéLe, demandéPar, motif } = modification.payload;

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
