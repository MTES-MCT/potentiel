import { DocumentProjet, Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToRecoursRejetéTimelineItemProps = (
  event: Éliminé.Recours.RecoursRejetéEvent,
): TimelineItemProps => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = event.payload;

  return {
    date: rejetéLe,
    title: 'Demande de recours rejetée',
    actor: rejetéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Éliminé.Recours.TypeDocumentRecours.recoursRejeté.formatter(),
        rejetéLe,
        format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse du signée du recours rejeté le ${formatDateToText(rejetéLe)}`,
    },
  };
};
