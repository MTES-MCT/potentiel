import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { HistoriquePuissanceTimelineProps } from '.';

export const mapToChangementPuissanceEnregistréTimelineItemProps = (
  record: Historique.PuissanceHistoryRecord,
  unitéPuissance: HistoriquePuissanceTimelineProps['unitéPuissance'],
) => {
  const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, puissance, raison } =
    record.payload as Lauréat.Puissance.ChangementPuissanceEnregistréEvent['payload'];
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
            {puissance} {unitéPuissance}
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
                Lauréat.Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
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
