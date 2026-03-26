import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

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
