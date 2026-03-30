import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationConformitéEnregistréeTimelineItemProps = (
  event: Lauréat.Achèvement.AttestationConformitéEnregistréeEvent,
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
    'attestation-conformite': {
      format,
    },
  });

  return {
    date: enregistréeLe,
    title: "Enregistrement de l'attestation de conformité",
    actor: enregistréePar,
    file: {
      document: attestation,
      ariaLabel: `Télécharger l'attestation de conformité du projet`,
    },
  };
};
