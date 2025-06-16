import { DocumentProjet } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const {
      identifiantProjet,
      rejetéLe,
      rejetéPar,
      réponseSignée: { format },
    } = modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent['payload'];

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      GarantiesFinancières.TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
      rejetéLe,
      format,
    ).formatter();

    return {
      date: rejetéLe,
      icon,
      title: (
        <div>
          La demande de mainlevée des garanties financières a été rejetée par{' '}
          <span className="font-semibold">{rejetéPar}</span>{' '}
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
