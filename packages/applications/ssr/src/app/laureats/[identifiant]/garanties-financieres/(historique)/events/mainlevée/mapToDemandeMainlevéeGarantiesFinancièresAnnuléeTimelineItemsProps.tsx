import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de mainlevée des garanties financières annulée',
    actor: annuléPar,
  };
};
