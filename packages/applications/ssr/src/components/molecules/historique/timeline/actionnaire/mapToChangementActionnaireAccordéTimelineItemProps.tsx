import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Recours } from '@potentiel-domain/elimine';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementActionnaireAccordéTimelineItemProps = (
  changementAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    payload: {
      accordéLe,
      accordéPar,
      identifiantProjet,
      réponseSignée: { format },
      nouvelActionnaire,
    },
  } = changementAccordé.payload as Actionnaire.ChangementActionnaireAccordéEvent;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Recours.TypeDocumentRecours.recoursAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        Changement d'actionnaire accordé par {<span className="font-semibold">{accordéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex gap-2">
        <div>
          Nouvel actionnaire <span className="font-semibold">{nouvelActionnaire}</span>
        </div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      </div>
    ),
  };
};
