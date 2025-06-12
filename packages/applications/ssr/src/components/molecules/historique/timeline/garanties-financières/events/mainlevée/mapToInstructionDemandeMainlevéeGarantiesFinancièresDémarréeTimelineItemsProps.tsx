import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { démarréLe, démarréPar } =
    modification.payload as GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent['payload'];

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
