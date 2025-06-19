import { Lauréat } from '@potentiel-domain/projet';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { enregistréLe, enregistréPar } =
    modification.payload as Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent['payload'];

  return {
    date: enregistréLe,
    title: (
      <div>
        Attestion de garanties financières enregistrée par{' '}
        {<span className="font-semibold">{enregistréPar}</span>}
      </div>
    ),
  };
};
