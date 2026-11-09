import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
): TimelineItemProps => {
  const { démarréLe, démarréPar } = event.payload;

  return {
    date: démarréLe,
    title: 'Demande de mainlevée des garanties financières passée en instruction',
    actor: démarréPar,
  };
};
