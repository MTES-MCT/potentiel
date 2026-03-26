import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToAbandonAccordéTimelineItemProps = (
  event: Lauréat.Abandon.AbandonAccordéEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar } = event.payload;

  return {
    date: accordéLe,
    title: "Demande d'abandon accordée",
    actor: accordéPar,
    file: {
      document: Lauréat.Abandon.DocumentAbandon.abandonAccordé(event.payload),
      ariaLabel: `Télécharger la réponse signée de l'abandon accordé le ${formatDateToText(accordéLe)}`,
    },
  };
};
