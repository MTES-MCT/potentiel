import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeDélaiCorrigéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    dateDemande,
    corrigéeLe,
    corrigéePar,
    pièceJustificative,
    nombreDeMois,
    raison,
  } = event.payload;

  return {
    date: corrigéeLe,
    title: 'Demande de délai corrigée',
    acteur: corrigéePar,
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
