import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { rejetéLe, rejetéPar } =
    modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent['payload'];

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
