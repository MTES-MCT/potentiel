import { DocumentProjet } from '@potentiel-domain/projet';
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

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
    enregistréeLe,
    format,
  );

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
