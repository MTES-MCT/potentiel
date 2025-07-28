import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ReadMore } from '@/components/atoms/ReadMore';

export const mapToDemandeDélaiCorrigéeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiCorrigéeEvent,
) => {
  const {
    identifiantProjet,
    dateDemande,
    corrigéeLe,
    corrigéePar,
    pièceJustificative,
    nombreDeMois,
    raison,
  } = record.payload;

  return {
    date: corrigéeLe,
    title: (
      <div>
        Demande de délai corrigée par {<span className="font-semibold">{corrigéePar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
        <div>
          Raison : <ReadMore text={raison} className="font-semibold" />
        </div>
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
                dateDemande,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
