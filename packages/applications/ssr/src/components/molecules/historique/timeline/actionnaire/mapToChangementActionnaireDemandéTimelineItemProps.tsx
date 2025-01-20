import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementActionnaireDemandéTimelineItemProps = (
  demandeChangement: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    payload: {
      demandéLe,
      demandéPar,
      identifiantProjet,
      pièceJustificative: { format },
      actionnaire,
    },
  } = demandeChangement.payload as Actionnaire.ChangementActionnaireDemandéEvent;

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: (
      <div>
        Changement d'actionnaire demandé par {<span className="font-semibold">{demandéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(pièceJustificative)}
        />
      </div>
    ),
  };
};
