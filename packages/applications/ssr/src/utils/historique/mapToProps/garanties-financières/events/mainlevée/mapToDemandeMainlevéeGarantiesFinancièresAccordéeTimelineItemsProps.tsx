import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
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
    title: (
      <div>
        La demande de mainlevée des garanties financières a été accordée par{' '}
        <span className="font-semibold">{accordéPar}</span>{' '}
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
