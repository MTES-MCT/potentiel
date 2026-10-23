import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAbandonAccordéTimelineItemProps = (
  event: Lauréat.Abandon.AbandonAccordéEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar, mainlevéeGarantiesFinancièresAccordée } = event.payload;

  return {
    date: accordéLe,
    title: mainlevéeGarantiesFinancièresAccordée
      ? "Demande d'abandon et mainlevée des garanties financières accordées"
      : "Demande d'abandon accordée",
    actor: accordéPar,
    file: {
      document: Lauréat.Abandon.DocumentAbandon.abandonAccordé(event.payload),
      ariaLabel: `Télécharger la réponse signée de l'abandon accordé le ${formatDateToText(accordéLe)}`,
    },
  };
};
