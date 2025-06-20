import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToAttestationConformitéTransmiseTimelineItemProps = (
  abandonAccordé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    identifiantProjet,
    attestation: { format },
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
  } = abandonAccordé.payload as Lauréat.Achèvement.AttestationConformitéTransmiseEvent['payload'];

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
    date,
    format,
  ).formatter();

  const preuveTransmission = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant.format,
  ).formatter();

  return {
    date,
    title: <div>Projet achevé</div>,
    content: (
      <>
        <DownloadDocument
          className="mb-0"
          label="Télécharger l'attestation de conformité"
          format="pdf"
          url={Routes.Document.télécharger(attestation)}
        />
        <DownloadDocument
          className="mb-0"
          label="Télécharger la preuve de transmission au cocontractant"
          format="pdf"
          url={Routes.Document.télécharger(preuveTransmission)}
        />
      </>
    ),
  };
};
