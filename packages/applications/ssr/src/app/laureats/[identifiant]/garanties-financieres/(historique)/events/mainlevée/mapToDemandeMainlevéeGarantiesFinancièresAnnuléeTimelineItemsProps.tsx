import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'La demande de mainlevée des garanties financières a été annulée',
    acteur: annuléPar,
  };
};
