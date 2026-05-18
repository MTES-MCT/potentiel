import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  event: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent,
): TimelineItemProps => {
  const { confirmationDemandéeLe, confirmationDemandéePar } = event.payload;

  return {
    date: confirmationDemandéeLe,
    title: "Confirmation demandée pour la demande d'abandon",
    actor: confirmationDemandéePar,
    file: {
      document: Lauréat.Abandon.DocumentAbandon.abandonAConfirmer(event.payload),
      ariaLabel: `Télécharger la demande de confirmation d'abandon du ${formatDateToText(confirmationDemandéeLe)}`,
    },
  };
};
