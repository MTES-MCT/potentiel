import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAbandonRejetéTimelineItemProps = (
  abandonAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = abandonAnnulé.payload as Lauréat.Abandon.AbandonRejetéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: <div>Abandon rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
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
