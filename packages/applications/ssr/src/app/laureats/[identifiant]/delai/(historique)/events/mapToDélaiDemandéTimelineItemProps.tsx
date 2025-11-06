import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDélaiDemandéTimelineItemProps = (
  event: Lauréat.Délai.DélaiDemandéEvent,
): TimelineItemProps => {
  const { identifiantProjet, demandéLe, demandéPar, pièceJustificative, nombreDeMois, raison } =
    event.payload;

  return {
    date: demandéLe,
    title: 'Délai demandé',
    acteur: demandéPar,
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
