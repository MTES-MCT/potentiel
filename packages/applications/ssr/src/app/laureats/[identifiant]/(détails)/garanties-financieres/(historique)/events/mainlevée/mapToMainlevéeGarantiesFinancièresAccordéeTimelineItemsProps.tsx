import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifMainlevéeLabel } from '../../../_helpers/getMotifMainlevéeLabel';

export const mapToMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresAccordéeEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar, motif } = event.payload;

  const réponseSignée = Lauréat.GarantiesFinancières.DocumentMainlevée.accordée(event.payload);

  return {
    date: accordéLe,
    title: 'Mainlevée des garanties financières accordée',
    actor: accordéPar,
    file: {
      document: réponseSignée,
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la mainlevée des garanties financières accordée le ${formatDateToText(accordéLe)}`,
    },
    reason: getMotifMainlevéeLabel(motif),
  };
};
