import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiRejetéeEvent,
): TimelineItemProps => {
  const { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée } = event.payload;

  return {
    date: rejetéeLe,
    title: 'Demande de délai rejetée',
    actor: rejetéePar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Délai.TypeDocumentDemandeDélai.demandeRejetée.formatter(),
        rejetéeLe,
        réponseSignée.format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de délai rejetée le ${formatDateToText(rejetéeLe)}`,
    },
  };
};
