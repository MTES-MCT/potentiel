import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToAbandonAccordéTimelineItemProps: MapToEventTimelineItemsProps = (
  abandonAccordé,
  icon,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = abandonAccordé.payload as Lauréat.Abandon.AbandonAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    icon,
    title: (
      <div>
        Demande d'abandon accordée par {<span className="font-semibold">{accordéPar}</span>}
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
