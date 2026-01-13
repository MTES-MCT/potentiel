import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.GarantiesFinancières.TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: 'La demande de mainlevée des garanties financières a été accordée',
    actor: accordéPar,
    details: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  };
};
