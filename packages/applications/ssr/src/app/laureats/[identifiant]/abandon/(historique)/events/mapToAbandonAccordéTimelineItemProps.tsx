import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToAbandonAccordéTimelineItemProps = (
  abandonAccordé: Lauréat.Abandon.AbandonAccordéEvent,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = abandonAccordé.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        Demande d'abandon accordée <TimelineItemUserEmail email={accordéPar} />
      </div>
    ),
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  };
};
