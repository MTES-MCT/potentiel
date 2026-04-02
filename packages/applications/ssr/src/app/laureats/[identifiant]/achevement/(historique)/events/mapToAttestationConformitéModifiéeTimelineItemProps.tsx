import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéModifiéeTimelineItemProps = (
  event: Lauréat.Achèvement.AttestationConformitéModifiéeEvent,
): TimelineItemProps => {
  const { identifiantProjet, modifiéeLe, modifiéePar } = event.payload;

  const attestation = Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
    identifiantProjet,
    'attestation-conformite': event.payload.attestation,
    enregistréLe: modifiéeLe,
  });

  return {
    date: modifiéeLe,
    title: "Modification de l'attestation de conformité",
    actor: modifiéePar,
    file: {
      document: attestation,
      label: "Télécharger l'attestation de conformité",
      ariaLabel: `Télécharger l'attestation de conformité modifiée le ${formatDateToText(modifiéeLe)}`,
    },
  };
};
