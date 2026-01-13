import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementActionnaireRejetéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent,
): TimelineItemProps => {
  const {
    rejetéLe,
    rejetéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  return {
    date: rejetéLe,
    title: "Demande de changement d'actionnaire rejetée",
    actor: rejetéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
        rejetéLe,
        format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée pour la demande de changement d'actionnaire rejetée le ${formatDateToText(rejetéLe)}`,
    },
  };
};
