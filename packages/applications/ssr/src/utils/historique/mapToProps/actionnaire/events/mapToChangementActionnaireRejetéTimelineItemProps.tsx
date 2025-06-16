import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToActionnaireTimelineItemProps } from '../mapToActionnaireTimelineItemProps';

export const mapToChangementActionnaireRejetéTimelineItemProps: MapToActionnaireTimelineItemProps =
  (changementRejeté, icon) => {
    const {
      rejetéLe,
      rejetéPar,
      identifiantProjet,
      réponseSignée: { format },
    } = changementRejeté.payload as Actionnaire.ChangementActionnaireRejetéEvent['payload'];

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
      rejetéLe,
      format,
    ).formatter();

    return {
      date: rejetéLe,
      icon,
      title: (
        <div>
          Demande de changement d'actionnaire rejetée par{' '}
          {<span className="font-semibold">{rejetéPar}</span>}
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
