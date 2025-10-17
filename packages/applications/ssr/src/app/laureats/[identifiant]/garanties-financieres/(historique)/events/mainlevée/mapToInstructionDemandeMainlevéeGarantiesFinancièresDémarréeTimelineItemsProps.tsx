import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
): TimelineItemProps => {
  const { démarréLe, démarréPar } = event.payload;

  return {
    date: démarréLe,
    title: " L'instruction de la demande de mainlevée des garanties financières a été démarée",
    acteur: démarréPar,
  };
};
