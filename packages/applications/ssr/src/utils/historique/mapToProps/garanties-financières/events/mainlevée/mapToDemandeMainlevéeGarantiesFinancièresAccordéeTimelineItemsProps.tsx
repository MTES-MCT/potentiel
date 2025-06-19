import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { accordéLe, accordéPar } =
    modification.payload as Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent['payload'];

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
