import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  confirmationAbandonDemandée: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent,
) => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = confirmationAbandonDemandée.payload;

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
        Confirmation demandée pour la demande d'abandon{' '}
        <TimelineItemUserEmail email={confirmationDemandéePar} />
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
