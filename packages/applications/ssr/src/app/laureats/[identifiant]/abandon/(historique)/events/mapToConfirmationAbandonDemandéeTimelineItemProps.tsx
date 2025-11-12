import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToConfirmationAbandonDemandéeTimelineItemProps = (
  event: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent,
): TimelineItemProps => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
    confirmationDemandéeLe,
    format,
  ).formatter();

  return {
    date: confirmationDemandéeLe,
    title: "Confirmation demandée pour la demande d'abandon",
    acteur: confirmationDemandéePar,
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  };
};
