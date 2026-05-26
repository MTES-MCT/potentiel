import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { TimelineItemFile, type TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéModifiéeTimelineItemProps = (
  event:
    | Lauréat.Achèvement.AttestationConformitéModifiéeEventV1
    | Lauréat.Achèvement.AttestationConformitéModifiéeEvent,
): TimelineItemProps => {
  const { identifiantProjet, modifiéeLe, modifiéePar } = event.payload;

  const attestation = Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
    identifiantProjet,
    attestation: event.payload.attestation,
    enregistréLe: modifiéeLe,
  });

  const rapportAssocié =
    event.type !== 'AttestationConformitéModifiée-V1'
      ? Lauréat.Achèvement.DocumentAchèvement.rapportAssocié({
          identifiantProjet,
          enregistréLe: modifiéeLe,
          rapportAssocie: event.payload.rapportAssocié,
        })
      : undefined;

  return {
    date: modifiéeLe,
    title: "Modification de l'attestation de conformité",
    actor: modifiéePar,
    details: (
      <div className="flex flex-col gap-2">
        <TimelineItemFile
          label="Télécharger l'attestation de conformité"
          document={attestation}
          ariaLabel={`Télécharger l'attestation de conformité modifiée le ${formatDateToText(modifiéeLe)}`}
        />
        {rapportAssocié && (
          <TimelineItemFile
            label="Télécharger le rapport associé"
            document={rapportAssocié}
            ariaLabel={`Télécharger le rapport associé modifié le ${formatDateToText(modifiéeLe)}`}
          />
        )}
      </div>
    ),
  };
};
