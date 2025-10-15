import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
) => {
  const { rejetéLe, rejetéPar } = modification.payload;

  return {
    date: rejetéLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été rejetée par{' '}
        <span className="font-semibold">{rejetéPar}</span>{' '}
      </div>
    ),
  };
};
