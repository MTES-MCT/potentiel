import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Recours } from '@potentiel-domain/elimine';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToRecoursDemandéTimelineItemProps = (
  recoursDemandé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
  } = recoursDemandé.payload as Recours.RecoursDemandéEvent['payload'];

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Recours.TypeDocumentRecours.pièceJustificative.formatter(),
    demandéLe,
    format,
  ).formatter();

  return {
    date: demandéLe,
    title: (
      <div>
        Demande de recours déposée par {<span className="font-semibold">{demandéPar}</span>}
      </div>
    ),
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
