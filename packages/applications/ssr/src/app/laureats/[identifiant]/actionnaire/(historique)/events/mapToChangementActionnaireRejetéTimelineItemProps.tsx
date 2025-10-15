import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementActionnaireRejetéTimelineItemProps = (
  changementRejeté: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent,
) => {
  const {
    rejetéLe,
    rejetéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = changementRejeté.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: (
      <div>
        Demande de changement d'actionnaire rejetée <TimelineItemUserEmail email={rejetéPar} />
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
