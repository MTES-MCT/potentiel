import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementActionnaireAccordéTimelineItemProps = (
  changementAccordé: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
    nouvelActionnaire,
  } = changementAccordé.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        Demande de changement d'actionnaire accordée <TimelineItemUserEmail email={accordéPar} />
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{nouvelActionnaire}</span>
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
