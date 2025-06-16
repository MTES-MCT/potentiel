import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToActionnaireTimelineItemProps } from '../mapToActionnaireTimelineItemProps';

export const mapToChangementActionnaireEnregistréTimelineItemProps: MapToActionnaireTimelineItemProps =
  (modification, icon) => {
    const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, actionnaire } =
      modification.payload as Actionnaire.ChangementActionnaireEnregistréEvent['payload'];
    return {
      date: enregistréLe,
      icon,
      title: (
        <div>Actionnaire modifié par {<span className="font-semibold">{enregistréPar}</span>}</div>
      ),
      content: (
        <div className="flex flex-col gap-2">
          <div>
            Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
          </div>

          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
                enregistréLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        </div>
      ),
    };
  };
