import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRecoursDemandéTimelineItemProps = (
  event: Éliminé.Recours.RecoursDemandéEvent,
): TimelineItemProps => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
  } = event.payload;

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Éliminé.Recours.TypeDocumentRecours.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: 'Demande de recours déposée',
    acteur: demandéPar,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format="pdf"
        url={Routes.Document.télécharger(pièceJustificative)}
      />
    ),
  };
};
