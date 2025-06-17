import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { accordéLe, accordéPar } =
    modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent['payload'];

  return {
    date: accordéLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été accordée par{' '}
        <span className="font-semibold">{accordéPar}</span>{' '}
      </div>
    ),
  };
};
