import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalAnnuléTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de changement de représentant légal annulée',
    acteur: annuléPar,
  };
};
