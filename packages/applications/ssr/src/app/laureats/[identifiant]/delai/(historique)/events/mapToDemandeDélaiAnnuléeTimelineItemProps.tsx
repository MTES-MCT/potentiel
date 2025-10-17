import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeDélaiAnnuléeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiAnnuléeEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de délai annulée',
    acteur: annuléPar,
  };
};
