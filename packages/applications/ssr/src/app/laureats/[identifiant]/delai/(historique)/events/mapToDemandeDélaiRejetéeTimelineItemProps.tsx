import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiRejetéeEvent,
): TimelineItemProps => {
  const { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée } = event.payload;

  return {
    date: rejetéeLe,
    title: 'Demande de délai rejetée',
    acteur: rejetéePar,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(
          DocumentProjet.convertirEnValueType(
            identifiantProjet,
            Lauréat.Délai.TypeDocumentDemandeDélai.demandeRejetée.formatter(),
            rejetéeLe,
            réponseSignée.format,
          ).formatter(),
        )}
      />
    ),
  };
};
