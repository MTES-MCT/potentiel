import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Recours } from '@potentiel-domain/elimine';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToRecoursAccordéTimelineItemProps = (
  recoursAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = recoursAccordé.payload as Recours.RecoursAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Recours.TypeDocumentRecours.recoursAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: <div>Recours accordé par {<span className="font-semibold">{accordéPar}</span>}</div>,
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
