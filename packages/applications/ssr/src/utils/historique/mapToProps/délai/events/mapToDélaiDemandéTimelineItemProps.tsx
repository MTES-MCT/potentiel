import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Accordion } from '@/components/organisms/Accordion';

export const mapToDélaiDemandéTimelineItemProps = (record: Lauréat.Délai.DélaiDemandéEvent) => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, nombreDeMois, raison } =
    record.payload;

  return {
    date: demandéLe,
    title: <div>Délai demandé par {<span className="font-semibold">{demandéPar}</span>}</div>,
    content: (
      <Accordion
        title={
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Durée :</span> {nombreDeMois} mois
            </div>
            {pièceJustificative && (
              <DownloadDocument
                className="block mb-0"
                label="Télécharger la pièce justificative"
                format="pdf"
                url={Routes.Document.télécharger(
                  DocumentProjet.convertirEnValueType(
                    identifiantProjet,
                    Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
                    demandéLe,
                    pièceJustificative.format,
                  ).formatter(),
                )}
              />
            )}
          </div>
        }
        content={
          <div>
            <span className="font-semibold">Raison :</span> {raison}
          </div>
        }
      />
    ),
  };
};
