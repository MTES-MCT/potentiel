import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { rejetéLe, rejetéPar } =
    modification.payload as Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent['payload'];

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
