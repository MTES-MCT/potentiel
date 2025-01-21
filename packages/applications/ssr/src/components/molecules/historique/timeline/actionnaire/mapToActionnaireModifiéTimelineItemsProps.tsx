import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToActionnaireModifiéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { modifiéLe, modifiéPar, identifiantProjet, pièceJustificative, actionnaire } =
    modification.payload as Actionnaire.ActionnaireModifiéEvent['payload'];

  return {
    date: modifiéLe,
    title: <div>Actionnaire modifié par {<span className="font-semibold">{modifiéPar}</span>}</div>,
    content: (
      <div className="flex gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
                modifiéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
