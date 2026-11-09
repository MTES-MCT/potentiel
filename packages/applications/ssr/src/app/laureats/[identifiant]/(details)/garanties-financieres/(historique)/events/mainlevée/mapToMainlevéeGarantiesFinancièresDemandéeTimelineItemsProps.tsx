import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifMainlevéeLabel } from '../../../_helpers/getMotifMainlevéeLabel';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent,
): TimelineItemProps => {
  const { demandéLe, demandéPar, motif } = event.payload;

  return {
    date: demandéLe,
    title: 'Demande de mainlevée des garanties financières déposée',
    actor: demandéPar,
    reason: getMotifMainlevéeLabel(motif),
  };
};
