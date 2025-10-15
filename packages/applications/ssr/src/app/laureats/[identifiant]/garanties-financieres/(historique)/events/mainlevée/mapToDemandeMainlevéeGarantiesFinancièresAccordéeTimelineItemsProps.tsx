import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = modification.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.GarantiesFinancières.TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été accordée{' '}
        <TimelineItemUserEmail email={accordéPar} />
      </div>
    ),
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  };
};
