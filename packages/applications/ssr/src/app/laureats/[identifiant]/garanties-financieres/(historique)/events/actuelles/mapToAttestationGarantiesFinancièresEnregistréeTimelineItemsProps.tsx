import { Lauréat } from '@potentiel-domain/projet';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
) => {
  const { enregistréLe, enregistréPar } = modification.payload;

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
