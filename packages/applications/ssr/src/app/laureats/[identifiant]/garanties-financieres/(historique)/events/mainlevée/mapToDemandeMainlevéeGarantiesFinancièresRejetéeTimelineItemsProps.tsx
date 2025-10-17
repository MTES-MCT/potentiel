import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
): TimelineItemProps => {
  const { rejetéLe, rejetéPar } = event.payload;

  return {
    date: rejetéLe,
    title: 'La demande de mainlevée des garanties financières a été rejetée',
    acteur: rejetéPar,
  };
};
