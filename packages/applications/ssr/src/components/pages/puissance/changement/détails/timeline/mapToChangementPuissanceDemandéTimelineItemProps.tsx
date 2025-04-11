import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Puissance } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { HistoriquePuissanceTimelineProps, PuissanceHistoryRecord } from '.';

export const mapToChangementPuissanceDemandéTimelineItemProps = (
  record: PuissanceHistoryRecord,
  unitéPuissance: HistoriquePuissanceTimelineProps['unitéPuissance'],
) => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, puissance } =
    record.payload as Puissance.ChangementPuissanceDemandéEvent['payload'];

  return {
    date: demandéLe,
    title: (
      <div>
        Changement de puissance demandé par {<span className="font-semibold">{demandéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
                demandéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
