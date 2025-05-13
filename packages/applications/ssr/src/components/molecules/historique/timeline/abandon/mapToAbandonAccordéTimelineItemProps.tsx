import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';
import { Abandon } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAbandonAccordéTimelineItemProps = (
  abandonAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = abandonAccordé.payload as Lauréat.Abandon.AbandonAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: <div>Abandon accordé par {<span className="font-semibold">{accordéPar}</span>}</div>,
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
