import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAbandonDemandéTimelineItemProps = (
  abandonDemandé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(abandonDemandé)
    .with(
      { type: 'AbandonDemandé-V1' },
      (event) => event as unknown as Abandon.AbandonDemandéEventV1,
    )
    .with({ type: 'AbandonDemandé-V2' }, (event) => event as unknown as Abandon.AbandonDemandéEvent)
    .otherwise(() => undefined);

  if (!event) {
    return {
      date: abandonDemandé.createdAt as DateTime.RawType,
      title: 'Étape abandon demandé inconnue',
    };
  }

  const { demandéLe, demandéPar, identifiantProjet, pièceJustificative } = event.payload;

  return {
    date: demandéLe,
    title: <div>Demande déposée par {<span className="font-semibold">{demandéPar}</span>}</div>,
    content: (
      <>
        {event.type === 'AbandonDemandé-V1' && event.payload.recandidature && (
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
