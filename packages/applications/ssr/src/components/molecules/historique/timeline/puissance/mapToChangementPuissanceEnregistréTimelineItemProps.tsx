import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Puissance } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { PuissanceHistoryRecord } from '.';

export const mapToChangementPuissanceEnregistréTimelineItemProps = (
  record: PuissanceHistoryRecord,
) => {
  const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, puissance, raison } =
    record.payload as Puissance.ChangementPuissanceEnregistréEvent['payload'];
  return {
    date: enregistréLe,
    title: (
      <div>Puissance modifiée par {<span className="font-semibold">{enregistréPar}</span>}</div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {record.unitePuissance}
          </span>
        </div>
        {raison && (
          <div>
            Raison : <span className="font-semibold">{raison}</span>
          </div>
        )}
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
                enregistréLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
