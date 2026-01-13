import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de changement de puissance annulée',
    actor: annuléPar,
  };
};
