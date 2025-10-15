import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToRecoursDemandéTimelineItemProps = (
  recoursDemandé: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    demandéLe,
    demandéPar,
    identifiantProjet,
    pièceJustificative: { format },
  } = recoursDemandé.payload as Éliminé.Recours.RecoursDemandéEvent['payload'];

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Éliminé.Recours.TypeDocumentRecours.pièceJustificative.formatter(),
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
