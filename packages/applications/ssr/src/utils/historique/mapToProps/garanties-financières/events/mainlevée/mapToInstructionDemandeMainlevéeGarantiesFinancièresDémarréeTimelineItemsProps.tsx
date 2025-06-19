import { Lauréat } from '@potentiel-domain/projet';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { démarréLe, démarréPar } =
    modification.payload as Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent['payload'];

  return {
    date: démarréLe,
    title: (
      <div>
        L'instruction de la demande de mainlevée des garanties financières a été démarée par{' '}
        <span className="font-semibold">{démarréPar}</span>{' '}
      </div>
    ),
  };
};
