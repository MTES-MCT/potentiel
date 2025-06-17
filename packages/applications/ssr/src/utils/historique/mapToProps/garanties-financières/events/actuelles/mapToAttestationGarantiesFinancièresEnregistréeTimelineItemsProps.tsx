import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { enregistréLe, enregistréPar } =
    modification.payload as GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent['payload'];

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
