import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
) => {
  const { démarréLe, démarréPar } = modification.payload;

  return {
    date: démarréLe,
    title: (
      <div>
        L'instruction de la demande de mainlevée des garanties financières a été démarée{' '}
        <TimelineItemUserEmail email={démarréPar} />
      </div>
    ),
  };
};
