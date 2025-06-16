import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToActionnaireTimelineItemProps } from '../mapToActionnaireTimelineItemProps';

export const mapToChangementActionnaireAccordéTimelineItemProps: MapToActionnaireTimelineItemProps =
  (changementAccordé, icon) => {
    const {
      accordéLe,
      accordéPar,
      identifiantProjet,
      réponseSignée: { format },
      nouvelActionnaire,
    } = changementAccordé.payload as Actionnaire.ChangementActionnaireAccordéEvent['payload'];

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
      accordéLe,
      format,
    ).formatter();

    return {
      date: accordéLe,
      icon,
      title: (
        <div>
          Demande de changement d'actionnaire accordée par{' '}
          {<span className="font-semibold">{accordéPar}</span>}
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
