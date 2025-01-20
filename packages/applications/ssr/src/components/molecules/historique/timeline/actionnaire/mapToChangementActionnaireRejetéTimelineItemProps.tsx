import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementActionnaireRejetéTimelineItemProps = (
  changementRejeté: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    payload: {
      rejetéLe,
      rejetéPar,
      identifiantProjet,
      réponseSignée: { format },
    },
  } = changementRejeté.payload as Actionnaire.ChangementActionnaireRejetéEvent;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: (
      <div>
        Changement d'actionnaire rejeté par {<span className="font-semibold">{rejetéPar}</span>}
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
