import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Éliminé } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToRecoursTimelineItemProps } from '../mapToRecoursTimelineItemProps';

export const mapToRecoursRejetéTimelineItemProps: MapToRecoursTimelineItemProps = (
  recoursRejeté,
  icon,
) => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = recoursRejeté.payload as Éliminé.Recours.RecoursRejetéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Éliminé.Recours.TypeDocumentRecours.recoursRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    icon,
    title: (
      <div>Demande de recours rejetée par {<span className="font-semibold">{rejetéPar}</span>}</div>
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
