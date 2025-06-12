import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    identifiantProjet,
    enregistréLe,
    enregistréPar,
    attestation: { format },
  } = modification.payload as GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent['payload'];

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
    enregistréLe,
    format,
  ).formatter();

  return {
    date: enregistréLe,
    title: (
      <div>
        Attestion de garanties financières enregistrée par{' '}
        {<span className="font-semibold">{enregistréPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(attestation)}
        />
      </div>
    ),
  };
};
