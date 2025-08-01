import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToAttestationConformitéTransmiseTimelineItemProps = (
  attestationConformitéTransmise: Lauréat.Achèvement.AttestationConformité.AttestationConformitéTransmiseEvent,
) => {
  const {
    identifiantProjet,
    attestation: { format },
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
  } = attestationConformitéTransmise.payload;

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
    date,
    format,
  ).formatter();

  const preuveTransmission = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant.format,
  ).formatter();

  return {
    date,
    title: <div>Transmission de l'attestation de conformité</div>,
    content: (
      <div className="flex flex-col gap-2">
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
        <div>
          Date de transmission au cocontractant :{' '}
          <span className="font-semibold">
            {<FormattedDate date={dateTransmissionAuCocontractant} />}
          </span>
        </div>
      </div>
    ),
  };
};
