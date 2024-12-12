import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAbandonDemandéTimelineItemProps = (
  abandonDemandé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, demandéPar, identifiantProjet, recandidature, pièceJustificative } =
    abandonDemandé.payload as Abandon.AbandonDemandéEvent['payload'];

  return {
    date: demandéLe,
    title: <div>Demande déposée par {<span className="font-semibold">{demandéPar}</span>}</div>,
    content: (
      <>
        {recandidature && (
          <div className="mb-4">
            Le projet s'inscrit dans un{' '}
            <span className="font-semibold">contexte de recandidature</span>
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
                Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
                demandéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </>
    ),
  };
};
