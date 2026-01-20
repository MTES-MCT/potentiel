import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAbandonAnnuléTimelineItemProps = (
  event: Lauréat.Abandon.AbandonAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: "Demande d'abandon annulée",
    actor: annuléPar,
  };
};
