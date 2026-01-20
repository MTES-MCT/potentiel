import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéTransmiseTimelineItemProps = (
  event: Lauréat.Achèvement.AttestationConformitéTransmiseEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    attestation: { format },
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
    utilisateur,
  } = event.payload;

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
    date,
    format,
  ).formatter();

  const preuveTransmission = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant.format,
  ).formatter();

  return {
    date,
    title: "Transmission de l'attestation de conformité",
    actor: utilisateur,
    details: (
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
