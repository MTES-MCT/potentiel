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

  const attestation = Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
    identifiantProjet,
    enregistréLe: date,
    'attestation-conformite': {
      format,
    },
  });

  const preuveTransmission =
    Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
      identifiantProjet,
      enregistréLe: dateTransmissionAuCocontractant,
      'preuve-transmission-attestation-conformite': {
        format: preuveTransmissionAuCocontractant.format,
      },
    });

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
          label="Télécharger la preuve de transmission au Cocontractant"
          document={preuveTransmission}
          ariaLabel={`Télécharger la preuve de transmission au Cocontractant du projet achevé le ${formatDateToText(dateTransmissionAuCocontractant)}`}
        />
        <div>
          Date de transmission au Cocontractant :{' '}
          <span className="font-semibold">
            {<FormattedDate date={dateTransmissionAuCocontractant} />}
          </span>
        </div>
      </div>
    ),
  };
};
