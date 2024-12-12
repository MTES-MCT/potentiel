import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Abandon } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  confirmationAbandonDemandée: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = confirmationAbandonDemandée.payload as Abandon.ConfirmationAbandonDemandéeEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
    confirmationDemandéeLe,
    format,
  ).formatter();

  return {
    date: confirmationDemandéeLe,
    title: (
      <div>
        Confirmation demandée par {<span className="font-semibold">{confirmationDemandéePar}</span>}
      </div>
    ),
    content: (
      <>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      </>
    ),
  };
};
