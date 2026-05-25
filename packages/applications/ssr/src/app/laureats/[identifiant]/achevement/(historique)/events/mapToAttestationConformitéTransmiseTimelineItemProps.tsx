import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemFile, type TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéTransmiseTimelineItemProps = (
  event:
    | Lauréat.Achèvement.AttestationConformitéTransmiseEventV1
    | Lauréat.Achèvement.AttestationConformitéTransmiseEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    attestation,
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    date,
    utilisateur,
  } = event.payload;

  const attestationConformité = Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
    identifiantProjet,
    enregistréLe: date,
    attestation,
  });

  const rapportAssocié =
    event.type === 'AttestationConformitéTransmise-V2'
      ? Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
          identifiantProjet,
          enregistréLe: date,
          rapportAssocie: event.payload.rapportAssocié,
        })
      : undefined;

  const preuveTransmission =
    Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
      identifiantProjet,
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant,
    });

  return {
    date,
    title: "Transmission de l'achèvement réel",
    actor: utilisateur,
    details: (
      <div className="flex flex-col gap-2">
        <TimelineItemFile
          label="Télécharger l'attestation de conformité"
          document={attestationConformité}
          ariaLabel={`Télécharger l'attestation de conformité du projet achevé le ${formatDateToText(date)}`}
        />
        {rapportAssocié && (
          <TimelineItemFile
            label="Télécharger le rapport associé"
            document={rapportAssocié}
            ariaLabel={`Télécharger le rapport associé du projet achevé le ${formatDateToText(date)}`}
          />
        )}
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
