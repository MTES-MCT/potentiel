import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
) => {
  const { annuléLe, annuléPar } = modification.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été annulée par{' '}
        <span className="font-semibold">{annuléPar}</span>{' '}
      </div>
    ),
  };
};
