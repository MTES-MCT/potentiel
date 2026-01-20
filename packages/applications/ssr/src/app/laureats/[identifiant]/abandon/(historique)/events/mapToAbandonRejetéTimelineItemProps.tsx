import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToAbandonRejetéTimelineItemProps = (
  event: Lauréat.Abandon.AbandonRejetéEvent,
): TimelineItemProps => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = event.payload;

  return {
    date: rejetéLe,
    title: "Demande d'abandon rejetée",
    actor: rejetéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
        rejetéLe,
        format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de l'abandon rejeté le ${formatDateToText(rejetéLe)}`,
    },
  };
};
