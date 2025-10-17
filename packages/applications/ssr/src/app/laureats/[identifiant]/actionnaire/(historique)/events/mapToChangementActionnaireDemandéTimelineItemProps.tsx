import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementActionnaireDemandéTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent,
): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
    actionnaire,
  } = event.payload;

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: "Demande de changement d'actionnaire déposée",
    acteur: demandéPar,
    content: (
      <div className="flex flex-col gap-2">
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
