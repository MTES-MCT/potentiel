import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  confirmationAbandonDemandée: Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel,
) => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = confirmationAbandonDemandée.payload as Lauréat.Abandon.ConfirmationAbandonDemandéeEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
    confirmationDemandéeLe,
    format,
  ).formatter();

  return {
    date: confirmationDemandéeLe,
    title: (
      <div>
        Confirmation demandée pour la demande d'abandon par{' '}
        {<span className="font-semibold">{confirmationDemandéePar}</span>}
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
