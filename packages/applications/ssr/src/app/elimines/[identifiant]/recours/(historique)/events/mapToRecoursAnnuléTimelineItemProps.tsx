import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRecoursAnnuléTimelineItemProps = (
  event: Éliminé.Recours.RecoursAnnuléEvent,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;

  return {
    date: annuléLe,
    title: 'Demande de recours annulée',
    actor: annuléPar,
  };
};
