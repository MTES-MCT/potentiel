import { DocumentProjet } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const {
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée: { format },
    } = modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent['payload'];

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      GarantiesFinancières.TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
      accordéLe,
      format,
    ).formatter();

    return {
      date: accordéLe,
      icon,
      title: (
        <div>
          La demande de mainlevée des garanties financières a été accordée par{' '}
          <span className="font-semibold">{accordéPar}</span>{' '}
        </div>
      ),
      content: (
        <DownloadDocument
          className="mb-0"
          label="Télécharger le courrier de réponse signée"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      ),
    };
  };
