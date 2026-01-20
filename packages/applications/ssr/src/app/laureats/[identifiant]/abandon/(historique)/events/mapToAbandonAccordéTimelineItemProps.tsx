import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToAbandonAccordéTimelineItemProps = (
  event: Lauréat.Abandon.AbandonAccordéEvent,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  return {
    date: accordéLe,
    title: "Demande d'abandon accordée",
    actor: accordéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
        accordéLe,
        format,
      ),
      ariaLabel: `Télécharger la réponse signée de l'abandon accordé le ${formatDateToText(accordéLe)}`,
    },
  };
};
