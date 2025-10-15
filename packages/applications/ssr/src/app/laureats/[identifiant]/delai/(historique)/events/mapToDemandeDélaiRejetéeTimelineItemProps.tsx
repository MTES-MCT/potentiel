import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiRejetéeEvent,
) => {
  const { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée } = record.payload;

  return {
    date: rejetéeLe,
    title: (
      <div>
        Demande de délai rejetée <TimelineItemUserEmail email={rejetéePar} />
      </div>
    ),
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
