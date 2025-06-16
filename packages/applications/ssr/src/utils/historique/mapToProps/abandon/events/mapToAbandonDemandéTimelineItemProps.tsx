import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToAbandonDemandéTimelineItemProps: MapToEventTimelineItemsProps = (
  abandonDemandé,
  icon,
) => {
  const event = match(abandonDemandé)
    .with(
      { type: 'AbandonDemandé-V1' },
      (event) => event as unknown as Lauréat.Abandon.AbandonDemandéEventV1,
    )
    .with(
      { type: 'AbandonDemandé-V2' },
      (event) => event as unknown as Lauréat.Abandon.AbandonDemandéEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(abandonDemandé);
  }

  const { demandéLe, demandéPar, identifiantProjet, pièceJustificative } = event.payload;

  return {
    date: demandéLe,
    icon,
    title: (
      <div>Demande d'abandon déposée par {<span className="font-semibold">{demandéPar}</span>}</div>
    ),
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
                Lauréat.Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
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
