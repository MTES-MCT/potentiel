import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { TimelineItemFile, type TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéEnregistréeTimelineItemProps = (
  event:
    | Lauréat.Achèvement.AttestationConformitéEnregistréeEventV1
    | Lauréat.Achèvement.AttestationConformitéEnregistréeEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    attestationConformité: { format },
    enregistréeLe,
    enregistréePar,
  } = event.payload;

  const attestation = Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
    identifiantProjet,
    enregistréLe: enregistréeLe,
    attestation: { format },
  });

  const rapportAssocié =
    event.type !== 'AttestationConformitéEnregistrée-V1'
      ? Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
          identifiantProjet,
          enregistréLe: enregistréeLe,
          rapportAssocie: { format: event.payload.rapportAssocié.format },
        })
      : undefined;

  return {
    date: enregistréeLe,
    title: `Enregistrement de l'attestation de conformité${rapportAssocié && ' avec son rapport associé'}`,
    actor: enregistréePar,
    details: (
      <div className="flex flex-col gap-2">
        <TimelineItemFile
          document={attestation}
          label="Télécharger l'attestation de conformité"
          ariaLabel={`Télécharger l'attestation de conformité du projet achevé le ${formatDateToText(enregistréeLe)}`}
        />
        {rapportAssocié && (
          <TimelineItemFile
            label="Télécharger le rapport associé"
            document={rapportAssocié}
            ariaLabel={`Télécharger le rapport associé du projet achevé le ${formatDateToText(enregistréeLe)}`}
          />
        )}
      </div>
    ),
  };
};
