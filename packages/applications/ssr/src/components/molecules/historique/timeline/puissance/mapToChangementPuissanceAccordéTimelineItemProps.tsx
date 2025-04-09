import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Puissance } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementPuissanceAccordéTimelineItemProps = (
  changementAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
    nouvellePuissance,
  } = changementAccordé.payload as Puissance.ChangementPuissanceAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Puissance.TypeDocumentPuissance.changementAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        Changement de puissance accordé par {<span className="font-semibold">{accordéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance : <span className="font-semibold">{nouvellePuissance} MW</span>
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
