import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemFile, TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToAttestationConformitéModifiéeTimelineItemProps = (
  event: Lauréat.Achèvement.AttestationConformitéModifiéeEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    attestation,
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
    utilisateur,
  } = event.payload;

  const attestationConformité = attestation
    ? Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        identifiantProjet,
        enregistréLe: date,
        'attestation-conformite': {
          format: attestation.format,
        },
      })
    : undefined;

  const preuveTransmission = preuveTransmissionAuCocontractant
    ? Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
        identifiantProjet,
        enregistréLe: dateTransmissionAuCocontractant,
        'preuve-transmission-attestation-conformite': {
          format: preuveTransmissionAuCocontractant.format,
        },
      })
    : undefined;

  return {
    date,
    title: "Modification de l'attestation de conformité",
    actor: utilisateur,
    details: (
      <div className="flex flex-col gap-2">
        {attestationConformité && (
          <TimelineItemFile
            document={attestationConformité}
            label="Télécharger l'attestation de conformité"
            ariaLabel={`Télécharger l'attestation de conformité du projet achevé le ${formatDateToText(date)}`}
          />
        )}
        {preuveTransmission && (
          <TimelineItemFile
            label="Télécharger la preuve de transmission au Cocontractant"
            document={preuveTransmission}
            ariaLabel={`Télécharger la preuve de transmission au Cocontractant du projet achevé le ${formatDateToText(dateTransmissionAuCocontractant)}`}
          />
        )}
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
