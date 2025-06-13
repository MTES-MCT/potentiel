import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent['payload'];

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
