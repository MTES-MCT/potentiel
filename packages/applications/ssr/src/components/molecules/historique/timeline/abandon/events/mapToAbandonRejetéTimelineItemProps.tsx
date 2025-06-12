import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
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
    Lauréat.Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: (
      <div>Demande d'abandon rejetée par {<span className="font-semibold">{rejetéPar}</span>}</div>
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
