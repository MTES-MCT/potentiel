import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemFile, TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

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
  );

  const preuveTransmission = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant.format,
  );

  return {
    date,
    title: "Transmission de l'attestation de conformité",
    actor: utilisateur,
    details: (
      <div className="flex flex-col gap-2">
        <TimelineItemFile
          label="Télécharger l'attestation de conformité"
          document={attestation}
          ariaLabel={`Télécharger l'attestation de conformité du projet achevé le ${formatDateToText(date)}`}
        />
        <TimelineItemFile
          label="Télécharger la preuve de transmission au cocontractant"
          document={preuveTransmission}
          ariaLabel={`Télécharger la preuve de transmission au cocontractant du projet achevé le ${formatDateToText(dateTransmissionAuCocontractant)}`}
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
