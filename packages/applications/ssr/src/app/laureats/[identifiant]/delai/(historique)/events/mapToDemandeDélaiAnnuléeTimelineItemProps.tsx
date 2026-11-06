import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeDélaiAnnuléeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiAnnuléeEvent | Lauréat.Délai.DemandeDélaiAnnuléeEventV1,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de délai annulée',
    actor: annuléPar,
  };
};
