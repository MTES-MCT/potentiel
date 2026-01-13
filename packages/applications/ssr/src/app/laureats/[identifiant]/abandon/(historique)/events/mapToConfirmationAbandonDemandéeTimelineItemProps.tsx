import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  event: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent,
): TimelineItemProps => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  return {
    date: confirmationDemandéeLe,
    title: "Confirmation demandée pour la demande d'abandon",
    actor: confirmationDemandéePar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
        confirmationDemandéeLe,
        format,
      ),
      ariaLabel: `Télécharger la demande de confirmation d'abandon du ${formatDateToText(confirmationDemandéeLe)}`,
    },
  };
};
