import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Recours } from '@potentiel-domain/elimine';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToRecoursRejetéTimelineItemProps = (
  recoursRejeté: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = recoursRejeté.payload as Recours.RecoursRejetéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Recours.TypeDocumentRecours.recoursRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: <div>Recours rejeté par {<span className="font-semibold">{rejetéPar}</span>}</div>,
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
